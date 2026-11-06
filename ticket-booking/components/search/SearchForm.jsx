"use client";

import Form from "next/form";
import { useState } from "react";
import { stations } from "@/data/timetable";

function StationSelect({ label, name, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold tracking-wide text-gray-400 uppercase">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-lg bg-field px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand"
      >
        {stations.map((station) => (
          <option key={station.code} value={station.code}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// <Form action="/search"> sends the fields as a URL: /search?from=DHK&to=CTG&date=2026-10-06
export default function SearchForm({ defaultFrom, defaultTo, defaultDate, minDate, maxDate }) {
  // The two stations are controlled, so the swap button can change both
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const isSameStation = from === to;

  function swapStations() {
    setFrom(to);
    setTo(from);
  }

  return (
    <Form action="/search" className="rounded-2xl border border-line bg-card p-5 md:p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_1fr_auto] lg:items-end">
        <StationSelect label="From" name="from" value={from} onChange={setFrom} />

        <button
          type="button"
          onClick={swapStations}
          aria-label="Swap From and To"
          title="Swap stations"
          className="mx-auto -my-2 grid size-10 place-items-center rounded-full border border-line bg-page text-gray-300 transition hover:border-brand hover:text-brand lg:my-0 lg:mb-1"
        >
          {/* Two arrows: up and down on phones, left and right on large screens */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 rotate-90 lg:rotate-0"
          >
            <path d="M7 4L3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7" />
          </svg>
        </button>

        <StationSelect label="To" name="to" value={to} onChange={setTo} />

        <div>
          <label htmlFor="date" className="block text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Journey date
          </label>
          {/* Not controlled: the browser keeps its value, and the URL gets it on submit */}
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            min={minDate}
            max={maxDate}
            className="mt-1.5 w-full rounded-lg bg-field px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <button
          type="submit"
          disabled={isSameStation}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-gray-950 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search trains
        </button>
      </div>

      {isSameStation && (
        <p className="mt-3 text-sm text-amber-300" role="status">
          From and To are the same station. Pick a different one.
        </p>
      )}
    </Form>
  );
}
