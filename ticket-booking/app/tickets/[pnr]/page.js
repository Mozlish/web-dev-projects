import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelBooking } from "@/app/actions/booking";
import { requireUser } from "@/lib/auth";
import { getBooking } from "@/lib/data";
import {
  CANCEL_CHARGE_PERCENT,
  formatClock,
  formatDate,
  formatDuration,
  formatTaka,
  formatTimestamp,
} from "@/lib/rail";
import Barcode from "@/components/ticket/Barcode";
import CancelButton from "@/components/ticket/CancelButton";
import PrintButton from "@/components/ticket/PrintButton";

// Grey text that stays readable on white paper
const muted = "text-gray-400 print:text-gray-600";

function StatusBadge({ booking }) {
  let label = "Confirmed";
  let style = "bg-emerald-400/15 text-emerald-300 print:bg-emerald-100 print:text-emerald-800";
  if (booking.status === "cancelled") {
    label = "Cancelled";
    style = "bg-rose-500/15 text-rose-300 print:bg-rose-100 print:text-rose-800";
  } else if (booking.hasDeparted) {
    label = "Travelled";
    style = "bg-field text-gray-300 print:bg-gray-100 print:text-gray-700";
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}

export async function generateMetadata({ params }) {
  const { pnr } = await params;
  return { title: `Ticket ${pnr}` };
}

// Page 4: one e-ticket, at /tickets/RG4K7M2QXP
export default async function TicketPage({ params, searchParams }) {
  const { pnr } = await params;
  const { new: isNew } = await searchParams; // "new" is a reserved word too

  const user = await requireUser(`/tickets/${pnr}`);
  const booking = await getBooking(pnr, user.id);
  if (!booking) notFound(); // doesn't exist, OR belongs to someone else

  // A Server Action with the PNR already filled in. The browser gets a reference, not the code.
  const cancelThisTicket = cancelBooking.bind(null, booking.pnr);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/tickets" className="inline-block text-sm text-gray-400 transition hover:text-white print:hidden">
        ← My tickets
      </Link>

      {isNew && booking.status === "confirmed" && (
        <p role="status" className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-brand print:hidden">
          Booking confirmed! Your e-ticket is ready. Show it on your phone or print it.
        </p>
      )}

      <article className="overflow-hidden rounded-3xl border border-line bg-card print:rounded-none print:border-gray-300 print:bg-white">
        {/* Top: which ticket and the journey, on a soft green gradient */}
        <div className="bg-linear-to-b from-emerald-500/15 to-transparent p-6 md:p-8 print:bg-none">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={`text-xs font-semibold tracking-widest uppercase ${muted}`}>RailGo e-ticket · PNR</p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-wider">{booking.pnr}</p>
            </div>
            <StatusBadge booking={booking} />
          </div>

          <p className={`mt-6 text-sm ${muted}`}>{formatDate(booking.date, "long")}</p>
          <h1 className="mt-1 text-2xl font-bold">
            {booking.trainName} <span className={`font-normal ${muted}`}>({booking.trainId})</span>
          </h1>

          <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <div>
              <p className="text-2xl font-bold whitespace-nowrap tabular-nums sm:text-3xl">
                {formatClock(booking.departs)}
              </p>
              <p className={muted}>{booking.fromStation.fullName}</p>
            </div>
            <p className={`text-center text-sm whitespace-nowrap ${muted}`}>{formatDuration(booking.duration)}</p>
            <div className="text-right">
              <p className="text-2xl font-bold whitespace-nowrap tabular-nums sm:text-3xl">
                {formatClock(booking.arrives)}
                {booking.arrivesNextDay && <sup className="ml-0.5 text-sm text-amber-300 print:text-amber-700">+1</sup>}
              </p>
              <p className={muted}>{booking.toStation.fullName}</p>
            </div>
          </div>
        </div>

        {/* Perforated line: a dashed border with two "bites" out of the sides */}
        <div className="relative border-t-2 border-dashed border-line print:border-gray-300">
          <span className="absolute -top-3 -left-3 size-6 rounded-full bg-page print:hidden" />
          <span className="absolute -top-3 -right-3 size-6 rounded-full bg-page print:hidden" />
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_14rem] md:p-8">
          <div>
            <h2 className="font-semibold">Passengers · {booking.className}</h2>
            <table className="mt-3 w-full text-left text-sm">
              <thead className={`text-xs uppercase ${muted}`}>
                <tr>
                  <th scope="col" className="py-2 font-medium">
                    Seat
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Name
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line print:divide-gray-200">
                {booking.seats.map((seat) => (
                  <tr key={seat.seatId}>
                    <td className="py-2.5 font-mono font-semibold">{seat.seatId}</td>
                    <td className="py-2.5">{seat.name}</td>
                    <td className="py-2.5 text-right tabular-nums">{seat.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className={muted}>Contact</dt>
                <dd className="mt-0.5 font-medium">{booking.phone}</dd>
              </div>
              <div>
                <dt className={muted}>Paid with</dt>
                <dd className="mt-0.5 font-medium">{booking.paymentName}</dd>
              </div>
              <div className="col-span-2">
                <dt className={muted}>Booked on</dt>
                <dd className="mt-0.5 font-medium">{formatTimestamp(booking.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className={muted}>Fare × {booking.seats.length}</dt>
                <dd className="tabular-nums">{formatTaka(booking.fareTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className={muted}>Service charge</dt>
                <dd className="tabular-nums">{formatTaka(booking.serviceTotal)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold print:border-gray-200">
                <dt>Total paid</dt>
                <dd className="tabular-nums">{formatTaka(booking.total)}</dd>
              </div>
              {booking.status === "cancelled" && (
                <div className="flex justify-between font-semibold text-emerald-300 print:text-emerald-700">
                  <dt>Refund</dt>
                  <dd className="tabular-nums">{formatTaka(booking.refund)}</dd>
                </div>
              )}
            </dl>

            <div>
              <Barcode value={booking.pnr} />
              <p className={`mt-1 text-center font-mono text-xs tracking-widest ${muted}`}>{booking.pnr}</p>
            </div>
          </div>
        </div>
      </article>

      {booking.status === "cancelled" ? (
        <p className="rounded-xl bg-card px-4 py-3 text-sm text-gray-300 print:hidden">
          Cancelled on {formatTimestamp(booking.cancelledAt)}. {formatTaka(booking.refund)} goes back to your{" "}
          {booking.paymentName} account within 7 working days.
        </p>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <p className="text-sm text-gray-400">
            {booking.canCancel
              ? `Plans changed? Cancel any time before the train leaves: ${CANCEL_CHARGE_PERCENT}% of the fare is kept, the rest (${formatTaka(booking.refundIfCancelled)}) is refunded.`
              : "This journey is over, so the ticket can't be cancelled."}
          </p>
          <div className="flex shrink-0 gap-3">
            {booking.canCancel && (
              <CancelButton cancelAction={cancelThisTicket} refundText={formatTaka(booking.refundIfCancelled)} />
            )}
            <PrintButton />
          </div>
        </div>
      )}

      <p className={`text-xs ${muted}`}>
        Carry a photo ID for every passenger. Be on the platform 30 minutes before departure. Times are in Bangladesh
        time (UTC+6).
      </p>
    </div>
  );
}
