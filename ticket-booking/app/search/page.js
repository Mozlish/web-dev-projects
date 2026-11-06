import { searchTrains } from "@/lib/data";
import { formatDate, getBookingDates, getStation } from "@/lib/rail";
import SearchForm from "@/components/search/SearchForm";
import DateStrip from "@/components/search/DateStrip";
import TrainCard from "@/components/search/TrainCard";

export const metadata = {
  title: "Search trains",
};

// Anything wrong with the URL? A message, or null when we can search
function getSearchProblem({ from, to, date }, dates) {
  if (!from || !to || !date) return "Choose your stations and a date to see trains.";
  if (!getStation(from) || !getStation(to)) return "We don't know one of those stations. Pick them from the list.";
  if (from === to) return "From and To are the same station. Pick a different one.";
  if (!dates.includes(date)) return `You can book from today up to ${dates.length - 1} days ahead. Pick another date.`;
  return null;
}

// Page 2: /search?from=DHK&to=CTG&date=2026-10-06
export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const dates = getBookingDates();
  const problem = getSearchProblem(params, dates);

  // Good values from the URL fill the form; bad or missing ones fall back to defaults
  const from = getStation(params.from) ? params.from : "DHK";
  const to = getStation(params.to) ? params.to : "CTG";
  const date = dates.includes(params.date) ? params.date : dates[0];

  const results = problem ? [] : await searchTrains({ from, to, date });
  const bookableCount = results.filter((train) => train.status === "available").length;

  return (
    <div className="space-y-8">
      {/* key: a new search creates a fresh form, so its stations match the URL again */}
      <SearchForm
        key={`${from}-${to}-${date}`}
        defaultFrom={from}
        defaultTo={to}
        defaultDate={date}
        minDate={dates[0]}
        maxDate={dates.at(-1)}
      />

      {problem ? (
        <p className="rounded-2xl border border-dashed border-line py-16 text-center text-gray-400">{problem}</p>
      ) : (
        <>
          <DateStrip dates={dates} selected={date} from={from} to={to} />

          <div>
            <h1 className="text-3xl font-bold">
              {getStation(from).name} <span className="text-brand">→</span> {getStation(to).name}
            </h1>
            <p className="mt-1 text-gray-400">
              {formatDate(date, "long")} · {bookableCount} of {results.length}{" "}
              {results.length === 1 ? "train" : "trains"} available
            </p>
          </div>

          {results.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line py-16 text-center text-gray-400">
              No train runs directly from {getStation(from).name} to {getStation(to).name}. Try a route through Dhaka.
            </p>
          ) : (
            <section className="space-y-4" aria-label="Trains">
              {results.map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  from={from}
                  to={to}
                  date={date}
                  fromName={getStation(from).name}
                  toName={getStation(to).name}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
