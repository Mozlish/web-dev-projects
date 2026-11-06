"use client";

import { useState } from "react";

const legend = [
  { label: "Available", className: "border border-line bg-field" },
  { label: "Selected", className: "bg-brand" },
  { label: "Booked", className: "bg-rose-500/15" },
];

function Seat({ seat, isSelected, isFull, onToggle }) {
  let style = "border border-line bg-field text-gray-200 hover:border-brand hover:text-white";
  let status = "available";
  if (seat.isTaken) {
    style = "bg-rose-500/15 text-rose-300/40 line-through";
    status = "booked";
  } else if (isSelected) {
    style = "bg-brand text-gray-950";
    status = "selected";
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(seat.id)}
      // A booked seat can't be picked. When 4 are chosen, only chosen ones can be clicked (to drop them)
      disabled={seat.isTaken || (isFull && !isSelected)}
      aria-pressed={isSelected}
      aria-label={`Seat ${seat.id}, ${status}`}
      className={`h-11 rounded-lg text-sm font-semibold tabular-nums transition disabled:cursor-not-allowed ${style} ${
        isFull && !isSelected && !seat.isTaken ? "opacity-40" : ""
      }`}
    >
      {seat.number}
    </button>
  );
}

// The coach tabs and the seats of the open coach: 2 seats, the aisle, 2 seats
export default function SeatMap({ coaches, selected, isFull, onToggle }) {
  // Which coach tab is open. Only SeatMap cares, so the state lives here.
  const [coachIndex, setCoachIndex] = useState(0);
  const coach = coaches[coachIndex];

  // [1..32] -> [[1,2,3,4], [5,6,7,8], ...]
  const rows = [];
  for (let start = 0; start < coach.seats.length; start += 4) {
    rows.push(coach.seats.slice(start, start + 4));
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-5 md:p-6" aria-labelledby="seat-map-heading">
      <h2 id="seat-map-heading" className="text-xl font-semibold">
        Choose your seats
      </h2>
      <p className="mt-1 text-sm text-gray-400">Tap a free seat to pick it, tap it again to drop it.</p>

      {/* One tab per coach, with how many seats are free and how many you picked there */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Coaches">
        {coaches.map((item, index) => {
          const freeCount = item.seats.filter((seat) => !seat.isTaken).length;
          const pickedCount = item.seats.filter((seat) => selected.includes(seat.id)).length;
          const isActive = index === coachIndex;

          return (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setCoachIndex(index)}
              className={`shrink-0 rounded-xl border px-4 py-2 text-left transition ${
                isActive ? "border-brand bg-brand/10" : "border-line hover:border-gray-500"
              }`}
            >
              <span className="block text-sm font-semibold">
                Coach {item.name}
                {pickedCount > 0 && (
                  <span className="ml-2 rounded-full bg-brand px-1.5 text-xs text-gray-950">{pickedCount}</span>
                )}
              </span>
              <span className="block text-xs text-gray-400">{freeCount} free</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
        {legend.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className={`size-4 rounded ${item.className}`} />
            {item.label}
          </li>
        ))}
      </ul>

      {/* The coach itself */}
      <div
        role="tabpanel"
        aria-label={`Coach ${coach.name}`}
        className="mx-auto mt-6 max-w-sm rounded-3xl border-2 border-line p-4"
      >
        <p className="mb-4 rounded-lg bg-field py-1.5 text-center text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Front · Coach {coach.name}
        </p>
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-[1fr_1fr_1.5rem_1fr_1fr] gap-2">
              {row.slice(0, 2).map((seat) => (
                <Seat
                  key={seat.id}
                  seat={seat}
                  isSelected={selected.includes(seat.id)}
                  isFull={isFull}
                  onToggle={onToggle}
                />
              ))}
              {/* The aisle, with the row number */}
              <span className="grid place-items-center text-xs text-gray-600">{rowIndex + 1}</span>
              {row.slice(2).map((seat) => (
                <Seat
                  key={seat.id}
                  seat={seat}
                  isSelected={selected.includes(seat.id)}
                  isFull={isFull}
                  onToggle={onToggle}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
