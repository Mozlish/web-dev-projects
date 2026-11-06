"use client";

import { useActionState, useState } from "react";
import { bookTickets } from "@/app/actions/booking";
import { MAX_SEATS } from "@/lib/rail";
import PassengerForm from "./PassengerForm";
import SeatMap from "./SeatMap";
import TripSummary from "./TripSummary";

const initialState = { error: null, errors: {}, values: null };

// The booking screen. It owns the state both steps share:
// the picked seats, which step you're on, and the result of the last submit.
export default function BookingFlow({ trip, coaches, user }) {
  const [pickedSeats, setPickedSeats] = useState([]); // ["KA-12", "KA-13"]
  const [step, setStep] = useState("seats"); // "seats" -> "details"
  // isPending is true while bookTickets runs on the server
  const [state, formAction, isPending] = useActionState(bookTickets, initialState);

  // Derived on every render: if someone else booked a seat you picked,
  // the fresh seat map marks it taken, and it simply drops out of your list
  const takenIds = new Set(
    coaches.flatMap((coach) => coach.seats.filter((seat) => seat.isTaken).map((seat) => seat.id)),
  );
  const seats = pickedSeats.filter((seatId) => !takenIds.has(seatId));
  const isFull = seats.length >= MAX_SEATS;
  const isDetailsStep = step === "details" && seats.length > 0;

  function toggleSeat(seatId) {
    if (pickedSeats.includes(seatId)) {
      setPickedSeats(pickedSeats.filter((id) => id !== seatId));
    } else if (!isFull) {
      setPickedSeats([...seats, seatId]);
    }
  }

  function goToStep(nextStep) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-4">
        {/* Steps */}
        <ol className="flex gap-2 text-sm">
          {["Choose seats", "Passengers"].map((label, index) => {
            const isCurrent = isDetailsStep ? index === 1 : index === 0;
            return (
              <li
                key={label}
                aria-current={isCurrent ? "step" : undefined}
                className={`rounded-full px-3 py-1 font-medium whitespace-nowrap ${isCurrent ? "bg-brand text-gray-950" : "bg-field text-gray-400"}`}
              >
                {index + 1}. {label}
              </li>
            );
          })}
        </ol>

        {state.error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          >
            {state.error}
          </p>
        )}

        {/* Both steps stay mounted and we HIDE one. Unmounting would throw away
            the open coach tab and anything typed in the form */}
        <div hidden={isDetailsStep}>
          <SeatMap coaches={coaches} selected={seats} isFull={isFull} onToggle={toggleSeat} />
        </div>
        <div hidden={!isDetailsStep}>
          <PassengerForm trip={trip} seats={seats} user={user} state={state} formAction={formAction} />
        </div>
      </div>

      <TripSummary
        trip={trip}
        seats={seats}
        isDetailsStep={isDetailsStep}
        isPending={isPending}
        onContinue={() => goToStep("details")}
        onBack={() => goToStep("seats")}
      />
    </div>
  );
}
