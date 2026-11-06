import Link from "next/link";
import { getQuizCards } from "@/lib/data";
import { getCurrentParticipant } from "@/lib/participant";
import QuizCard from "@/components/QuizCard";

// Page 1: every quiz, at "/"
export default async function HomePage() {
  const participant = await getCurrentParticipant();
  const quizzes = await getQuizCards(participant?.id);

  return (
    <>
      <section className="mb-12">
        <span className="inline-block rounded-md bg-brand/20 px-3 py-1 text-sm font-semibold text-violet-200">
          Quiz Application
        </span>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
          {participant ? `Ready, ${participant.name.split(" ")[0]}?` : "Test what you know. Beat your friends."}
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400">
          Timed quizzes on JavaScript, React and Next.js. Answer against the clock, review every answer, and
          climb the leaderboard.
        </p>
        {!participant && (
          <Link
            href="/join"
            className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 font-semibold transition hover:bg-brand-dark"
          >
            Pick a name to start
          </Link>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Quizzes">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </section>
    </>
  );
}
