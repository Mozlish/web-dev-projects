// Shown instantly while /search loads on the server.
// Next.js wraps the page in <Suspense> and uses this as the fallback.
export default function SearchLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading trains">
      <div className="h-40 animate-pulse rounded-2xl bg-card lg:h-24" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="h-17 w-16 shrink-0 animate-pulse rounded-xl bg-card" />
        ))}
      </div>
      <div className="h-14 w-72 animate-pulse rounded-lg bg-card" />
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="h-56 animate-pulse rounded-2xl bg-card" />
      ))}
    </div>
  );
}
