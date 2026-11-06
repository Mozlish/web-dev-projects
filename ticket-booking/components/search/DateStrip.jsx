import Link from "next/link";
import { formatDate } from "@/lib/rail";

// One link per bookable day. Clicking a day keeps the stations and changes only the date.
export default function DateStrip({ dates, selected, from, to }) {
  return (
    <nav aria-label="Choose a travel date" className="flex gap-2 overflow-x-auto pb-1">
      {dates.map((date) => {
        const isActive = date === selected;
        const [weekday, day, month] = formatDate(date).split(" "); // "Tue 6 Oct"

        return (
          <Link
            key={date}
            href={`/search?${new URLSearchParams({ from, to, date })}`}
            aria-current={isActive ? "date" : undefined}
            className={`flex w-16 shrink-0 flex-col items-center rounded-xl border px-2 py-2 transition ${
              isActive
                ? "border-brand bg-brand/15 text-white"
                : "border-line bg-card text-gray-400 hover:border-gray-500 hover:text-white"
            }`}
          >
            <span className="text-xs">{weekday}</span>
            <span className="text-lg leading-tight font-bold">{day}</span>
            <span className="text-xs">{month}</span>
          </Link>
        );
      })}
    </nav>
  );
}
