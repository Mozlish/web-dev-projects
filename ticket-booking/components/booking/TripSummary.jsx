import { MAX_SEATS, SERVICE_CHARGE, formatClock, formatDuration, formatTaka, getPrice } from "@/lib/rail";

export default function TripSummary({ trip, seats, isDetailsStep, isPending, onContinue, onBack }) {
  // The same getPrice() the server uses, so what you see is what you'll pay.
  // The server still works it out again: this copy is only for showing.
  const price = getPrice(trip.fare, seats.length);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-line bg-card p-5">
        <p className="text-sm text-gray-400">{trip.dateLabel}</p>
        <h2 className="mt-1 text-lg font-semibold">
          {trip.trainName} <span className="font-normal text-gray-400">({trip.trainId})</span>
        </h2>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold tabular-nums">{formatClock(trip.departs)}</p>
            <p className="text-sm text-gray-400">{trip.from.name}</p>
          </div>
          <p className="pt-1.5 text-xs text-gray-500">{formatDuration(trip.duration)}</p>
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums">
              {formatClock(trip.arrives)}
              {trip.arrivesNextDay && <sup className="ml-0.5 text-xs text-amber-300">+1</sup>}
            </p>
            <p className="text-sm text-gray-400">{trip.to.name}</p>
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-field px-3 py-2 text-sm text-gray-300">
          {trip.className} · {formatTaka(trip.fare)} per seat
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-semibold">
          Your seats{" "}
          <span className="text-sm font-normal text-gray-400">
            ({seats.length} of {MAX_SEATS})
          </span>
        </h2>

        {seats.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">No seats yet. Pick up to {MAX_SEATS} on the coach map.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {seats.map((seatId) => (
              <li key={seatId} className="rounded-md bg-brand/15 px-2.5 py-1 text-sm font-semibold text-brand">
                {seatId}
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-gray-400">
            <dt>
              Fare ({formatTaka(trip.fare)} × {seats.length})
            </dt>
            <dd className="tabular-nums">{formatTaka(price.fareTotal)}</dd>
          </div>
          <div className="flex justify-between text-gray-400">
            <dt>
              Service charge ({formatTaka(SERVICE_CHARGE)} × {seats.length})
            </dt>
            <dd className="tabular-nums">{formatTaka(price.serviceTotal)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatTaka(price.total)}</dd>
          </div>
        </dl>

        {isDetailsStep ? (
          <div className="mt-5 space-y-2">
            {/* form="booking-form" connects this button to the form in the other column */}
            <button
              type="submit"
              form="booking-form"
              disabled={isPending}
              className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-gray-950 transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
            >
              {isPending ? "Confirming your seats..." : `Pay ${formatTaka(price.total)}`}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={isPending}
              className="w-full rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-field disabled:opacity-60"
            >
              Change seats
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onContinue}
            disabled={seats.length === 0}
            className="mt-5 w-full rounded-lg bg-brand px-5 py-3 font-semibold text-gray-950 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to passenger details
          </button>
        )}
      </div>
    </aside>
  );
}
