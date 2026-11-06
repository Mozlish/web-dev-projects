import JoinForm from "@/components/JoinForm";

export const metadata = {
  title: "Join",
};

// /join or /join?next=/quiz/react-fundamentals
export default async function JoinPage({ searchParams }) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md py-6 md:py-12">
      <div className="rounded-2xl border border-line bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold">Who&apos;s playing?</h1>
        <p className="mt-2 text-gray-400">
          Pick a name for the leaderboard. Taking turns on one computer? Each player joins with their own
          name, and &quot;Switch player&quot; hands over.
        </p>

        <div className="mt-8">
          <JoinForm nextPath={next ?? "/"} />
        </div>
      </div>
    </div>
  );
}
