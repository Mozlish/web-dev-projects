import Field from "@/components/Field";
import { paymentMethods } from "@/lib/rail";

// The details step: one block per seat, contact number and payment.
// It doesn't own any state: BookingFlow passes the action and its last result.
export default function PassengerForm({ trip, seats, user, state, formAction }) {
  const values = state.values; // null until the first submit
  const errors = state.errors ?? {};

  return (
    // id="booking-form": the Pay button in the summary is OUTSIDE this form, and finds it by id
    <form id="booking-form" action={formAction} className="space-y-6">
      {/* The trip and the seats travel as hidden fields */}
      <input type="hidden" name="trainId" value={trip.trainId} />
      <input type="hidden" name="from" value={trip.from.code} />
      <input type="hidden" name="to" value={trip.to.code} />
      <input type="hidden" name="date" value={trip.date} />
      <input type="hidden" name="classCode" value={trip.classCode} />
      {seats.map((seatId) => (
        <input key={seatId} type="hidden" name="seat" value={seatId} />
      ))}

      <section className="rounded-2xl border border-line bg-card p-5 md:p-6">
        <h2 className="text-xl font-semibold">Passenger details</h2>
        <p className="mt-1 text-sm text-gray-400">As written on each passenger&apos;s ID. Checked on the train.</p>

        <div className="mt-5 space-y-4">
          {seats.map((seatId, index) => {
            const typed = values?.passengers?.[seatId]; // what was sent last time, if anything
            const seatErrors = errors.passengers?.[seatId] ?? {};

            return (
              <fieldset key={seatId} className="grid gap-4 rounded-xl border border-line p-4 sm:grid-cols-[1fr_8rem]">
                <legend className="px-2 text-sm font-semibold text-brand">Seat {seatId}</legend>
                <Field
                  label="Full name"
                  name={`name-${seatId}`}
                  required
                  autoComplete={index === 0 ? "name" : "off"}
                  defaultValue={typed?.name ?? (index === 0 ? user.name : "")}
                  error={seatErrors.name}
                />
                <Field
                  label="Age"
                  name={`age-${seatId}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  required
                  defaultValue={typed?.age}
                  error={seatErrors.age}
                />
              </fieldset>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5 md:p-6">
        <h2 className="text-xl font-semibold">Contact and payment</h2>

        <Field
          className="mt-5 max-w-sm"
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          defaultValue={values?.phone ?? user.phone}
          error={errors.phone}
          hint="We send the ticket and any delay alerts here."
        />

        <fieldset className="mt-6" aria-describedby={errors.payment ? "payment-error" : undefined}>
          <legend className="text-sm font-medium text-gray-300">Pay with</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 transition has-checked:border-brand has-checked:bg-brand/10 has-focus-visible:ring-2 has-focus-visible:ring-brand"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  defaultChecked={(values?.payment ?? "bkash") === method.id}
                  className="size-4 accent-emerald-400"
                />
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>
          {errors.payment && (
            <p id="payment-error" className="mt-2 text-sm text-rose-400">
              {errors.payment}
            </p>
          )}
          <p className="mt-3 text-xs text-gray-500">Practice project: no real payment is taken.</p>
        </fieldset>
      </section>
    </form>
  );
}
