import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSeatPlan } from "@/lib/data";
import { getTrain } from "@/lib/rail";
import BookingFlow from "@/components/booking/BookingFlow";

export async function generateMetadata({ params }) {
  const { trainId } = await params;
  const train = getTrain(trainId);
  return { title: train ? `Book ${train.name}` : "Train not found" };
}

// Page 3: seats and passengers, at /trains/702?from=DHK&to=CTG&date=2026-10-06&class=S_CHAIR
export default async function BookTrainPage({ params, searchParams }) {
  const { trainId } = await params;
  const { from, to, date, class: classCode } = await searchParams; // "class" is a reserved word, so rename it

  // Check the trip first: a broken link gets a clear message, not a login screen
  const plan = await getSeatPlan({ trainId, from, to, date, classCode });

  if (plan.problem) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">This trip can&apos;t be booked</h1>
        <p className="mt-2 text-gray-400">{plan.problem}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-gray-950 transition hover:bg-brand-dark"
        >
          Search again
        </Link>
      </div>
    );
  }

  // Log in to book, then come straight back to this exact URL
  const backTo = `/trains/${trainId}?${new URLSearchParams({ from, to, date, class: classCode })}`;
  const user = await requireUser(backTo);

  const { trip, coaches } = plan;
  const backToSearch = `/search?${new URLSearchParams({ from, to, date })}`;

  return (
    <div className="space-y-6">
      <div>
        <Link href={backToSearch} className="text-sm text-gray-400 transition hover:text-white">
          ← All trains on this date
        </Link>
        <h1 className="mt-3 text-3xl font-bold">
          {trip.from.name} <span className="text-brand">→</span> {trip.to.name}
        </h1>
      </div>

      <BookingFlow trip={trip} coaches={coaches} user={user} />
    </div>
  );
}
