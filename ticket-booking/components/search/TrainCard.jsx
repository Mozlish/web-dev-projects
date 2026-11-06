import Link from "next/link";
import { formatClock, formatDuration, formatTaka } from "@/lib/rail";

// One row of times: 4:30 PM Dhaka ———— 5h 10m ———— 9:40 PM Chattogram
function Timeline({ train, fromName, toName }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5">
      <div>
        <p className="text-xl font-bold whitespace-nowrap tabular-nums sm:text-2xl">{formatClock(train.departs)}</p>
        <p className="text-sm text-gray-400">{fromName}</p>
      </div>

      <div className="text-center">
        <p className="text-xs whitespace-nowrap text-gray-400">{formatDuration(train.duration)}</p>
        <div className="relative my-1.5 h-px bg-line">
          <span className="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-brand" />
          <span className="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full bg-brand" />
        </div>
        <p className="text-xs text-gray-500">{train.km} km</p>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold whitespace-nowrap tabular-nums sm:text-2xl">
          {formatClock(train.arrives)}
          {train.arrivesNextDay && <sup className="ml-0.5 text-xs font-semibold text-amber-300">+1</sup>}
        </p>
        <p className="text-sm text-gray-400">{toName}</p>
      </div>
    </div>
  );
}

export default function TrainCard({ train, from, to, date, fromName, toName }) {
  const isAvailable = train.status === "available";

  return (
    <article
      className={`rounded-2xl border border-line bg-card p-5 md:p-6 ${isAvailable ? "" : "opacity-60"}`}
      aria-label={`${train.name} ${train.id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {train.name} <span className="font-normal text-gray-400">({train.id})</span>
        </h2>
        <p className="text-xs text-gray-400">{train.offDayName ? `Off day: ${train.offDayName}` : "Runs every day"}</p>
      </div>

      <div className="mt-4">
        <Timeline train={train} fromName={fromName} toName={toName} />
      </div>

      {train.status === "off-day" && (
        <p className="mt-5 rounded-lg bg-field px-4 py-3 text-sm text-gray-300">
          Doesn&apos;t run on {train.offDayName}s. Pick another date to book it.
        </p>
      )}
      {train.status === "departed" && (
        <p className="mt-5 rounded-lg bg-field px-4 py-3 text-sm text-gray-300">
          This train has already left {fromName} today.
        </p>
      )}

      {isAvailable && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {train.classes.map((seatClass) => {
            const isSoldOut = seatClass.seatsLeft === 0;
            // URLSearchParams builds "from=DHK&to=CTG&date=...&class=AC_S" and escapes it for us
            const href = `/trains/${train.id}?${new URLSearchParams({ from, to, date, class: seatClass.code })}`;

            return (
              <li key={seatClass.code} className="flex flex-col rounded-xl border border-line bg-page/60 p-4">
                <p className="text-sm text-gray-400">{seatClass.name}</p>
                <p className="mt-1 text-xl font-bold">{formatTaka(seatClass.fare)}</p>
                <p className={`mt-1 text-sm ${seatClass.seatsLeft < 10 ? "text-amber-300" : "text-gray-400"}`}>
                  {isSoldOut ? "No seats left" : `${seatClass.seatsLeft} seats left`}
                </p>
                {isSoldOut ? (
                  <span className="mt-4 rounded-lg bg-field px-4 py-2 text-center text-sm font-semibold text-gray-500">
                    Sold out
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="mt-4 rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-gray-950 transition hover:bg-brand-dark"
                  >
                    Select seats
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
