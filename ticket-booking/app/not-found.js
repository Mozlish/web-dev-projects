import Link from "next/link";

// Shown when notFound() is called, or for any URL that doesn't exist
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl font-black text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">Wrong platform</h1>
      <p className="mt-2 text-gray-400">
        We couldn&apos;t find that page or ticket. If it&apos;s a ticket, check that you&apos;re logged in to the
        account that booked it.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-gray-950 transition hover:bg-brand-dark"
      >
        Back to booking
      </Link>
    </div>
  );
}
