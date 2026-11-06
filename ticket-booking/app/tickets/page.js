import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getMyBookings } from "@/lib/data";
import { formatClock, formatDate, formatTaka } from "@/lib/rail";

export const metadata = {
  title: "My tickets",
};

const tabs = [
  { id: "upcoming", label: "Upcoming", empty: "No upcoming trips. Where to next?" },
  { id: "past", label: "Past", empty: "Trips you've taken will show up here." },
  { id: "cancelled", label: "Cancelled", empty: "No cancelled tickets." },
];

function TicketRow({ booking }) {
  const [weekday, day, month] = formatDate(booking.date).split(" ");

  return (
    <li>
      <Link
        href={`/tickets/${booking.pnr}`}
        className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4 transition hover:border-gray-500 sm:gap-6 sm:p-5"
      >
        {/* A calendar-style date block */}
        <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-field py-2">
          <span className="text-xs text-gray-400">{weekday}</span>
          <span className="text-2xl leading-tight font-bold">{day}</span>
          <span className="text-xs text-gray-400">{month}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">
            {booking.fromStation.name} → {booking.toStation.name}
          </p>
          <p className="mt-0.5 truncate text-sm text-gray-400">
            {booking.trainName} · {formatClock(booking.departs)} · {booking.className}
          </p>
          <p className="mt-0.5 text-sm text-gray-400">
            {booking.seats.length} {booking.seats.length === 1 ? "seat" : "seats"}:{" "}
            {booking.seats.map((seat) => seat.seatId).join(", ")}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-semibold tabular-nums">{formatTaka(booking.total)}</p>
          <p className="mt-0.5 font-mono text-xs text-gray-500">{booking.pnr}</p>
        </div>
      </Link>
    </li>
  );
}

// Page 5: all my tickets, at /tickets, /tickets?tab=past or /tickets?tab=cancelled
export default async function MyTicketsPage({ searchParams }) {
  const user = await requireUser("/tickets");
  const { tab } = await searchParams;

  const groups = await getMyBookings(user.id); // { upcoming: [...], past: [...], cancelled: [...] }
  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0]; // unknown tab -> Upcoming
  const bookings = groups[activeTab.id];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">My tickets</h1>
          <p className="mt-2 text-gray-400">Every trip you&apos;ve booked as {user.name}.</p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-brand-dark"
        >
          Book a new trip
        </Link>
      </div>

      {/* Tabs are links: each one is its own URL, so no useState is needed */}
      <nav aria-label="Ticket groups" className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((item) => {
          const isActive = item.id === activeTab.id;
          return (
            <Link
              key={item.id}
              href={item.id === "upcoming" ? "/tickets" : `/tickets?tab=${item.id}`}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-white text-gray-950" : "bg-card text-gray-400 hover:text-white"
              }`}
            >
              {item.label} <span className="ml-1 opacity-60">{groups[item.id].length}</span>
            </Link>
          );
        })}
      </nav>

      {bookings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line py-16 text-center text-gray-400">
          {activeTab.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <TicketRow key={booking.pnr} booking={booking} />
          ))}
        </ul>
      )}
    </div>
  );
}
