import Link from "next/link";
import { connection } from "next/server";
import { BOOKING_WINDOW_DAYS, getBookingDates, getStation } from "@/lib/rail";
import SearchForm from "@/components/search/SearchForm";

const popularRoutes = [
  ["DHK", "CTG"],
  ["DHK", "CXB"],
  ["DHK", "SYL"],
  ["DHK", "RJH"],
  ["DHK", "KLN"],
  ["CTG", "DHK"],
];

const features = [
  {
    title: "Pick your own seat",
    text: "See every coach and choose the exact seats you want, window or aisle.",
  },
  {
    title: `Book up to ${BOOKING_WINDOW_DAYS} days ahead`,
    text: "Search any day from today on, with live fares and seats for every class.",
  },
  {
    title: "E-ticket in seconds",
    text: "Your ticket is ready the moment you pay. Show it on your phone or print it.",
  },
];

// Page 1: the home page with the search form, at "/"
export default async function HomePage() {
  await connection(); // the dates below depend on today, so render on every request
  const dates = getBookingDates();
  const tomorrow = dates[1];

  return (
    <>
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-line bg-linear-to-br from-emerald-500/20 via-card to-card px-6 pt-10 pb-6 md:px-10 md:pt-14">
        <span className="inline-block rounded-md bg-brand/15 px-3 py-1 text-sm font-semibold text-brand">
          Ticket Booking
        </span>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
          Effortless railway tickets, at your fingertips.
        </h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          Search trains across Bangladesh, choose your seats on the coach map, and get your e-ticket in seconds.
        </p>

        <div className="mt-8">
          <SearchForm
            defaultFrom="DHK"
            defaultTo="CTG"
            defaultDate={tomorrow}
            minDate={dates[0]}
            maxDate={dates.at(-1)}
          />
        </div>
      </section>

      <section className="mb-12" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="text-xl font-semibold">
          Popular routes
        </h2>
        <p className="mt-1 text-sm text-gray-400">One tap to see tomorrow&apos;s trains.</p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map(([from, to]) => (
            <li key={`${from}-${to}`}>
              <Link
                href={`/search?${new URLSearchParams({ from, to, date: tomorrow })}`}
                className="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4 transition hover:border-brand"
              >
                <span className="font-medium">
                  {getStation(from).name} <span className="text-brand">→</span> {getStation(to).name}
                </span>
                <span className="text-sm text-gray-400">View trains</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Why RailGo">
        {features.map((feature, index) => (
          <div key={feature.title} className="rounded-2xl border border-line bg-card p-6">
            <span className="grid size-9 place-items-center rounded-lg bg-brand/15 font-bold text-brand">
              {index + 1}
            </span>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{feature.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
