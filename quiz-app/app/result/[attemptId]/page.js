import Link from "next/link";
import { notFound } from "next/navigation";
import { getResult } from "@/lib/data";
import { getCurrentParticipant } from "@/lib/participant";
import { formatTime, getGrade, getPercent } from "@/lib/quiz";
import ScoreRing from "@/components/result/ScoreRing";
import AnswerReview from "@/components/result/AnswerReview";

export async function generateMetadata({ params }) {
  const { attemptId } = await params;
  const result = await getResult(attemptId);
  return { title: result ? `${result.quiz.title} result` : "Result not found" };
}

// Page 3: one attempt's score and answer review, at "/result/[attemptId]"
export default async function ResultPage({ params }) {
  const { attemptId } = await params;
  const [result, viewer] = await Promise.all([getResult(attemptId), getCurrentParticipant()]);

  if (!result) notFound();

  const { attempt, quiz, participant, rank, playerCount, bestAttempt } = result;
  const isMine = viewer?.id === attempt.participantId;

  // Derived numbers
  const percent = getPercent(attempt.score, attempt.total);
  const grade = getGrade(percent);
  const answeredCount = Object.keys(attempt.answers).length;

  const stats = [
    { label: "Correct", value: attempt.score, color: "text-emerald-400" },
    { label: "Wrong", value: answeredCount - attempt.score, color: "text-rose-400" },
    { label: "Skipped", value: attempt.total - answeredCount, color: "text-gray-300" },
    { label: "Time", value: formatTime(attempt.timeTaken), color: "text-white" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link href="/" className="inline-block text-sm text-gray-400 transition hover:text-white">
        ← All quizzes
      </Link>

      {/* Summary */}
      <section className="rounded-2xl border border-line bg-card p-6 md:p-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
          <ScoreRing percent={percent} ringClass={grade.ring} />

          <div className="flex-1">
            <p className="text-sm text-gray-400">
              {isMine ? "Your result" : `${participant.name}'s result`} · {quiz.title}
            </p>
            <h1 className={`mt-1 text-3xl font-bold ${grade.color}`}>{grade.label}</h1>
            <p className="mt-2 text-gray-300">
              {attempt.score} out of {attempt.total} correct, in {formatTime(attempt.timeTaken)} of{" "}
              {formatTime(quiz.timeLimit)}.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              #{rank} of {playerCount} on the leaderboard
              {bestAttempt.id !== attempt.id &&
                ` (counting the best attempt: ${bestAttempt.score}/${bestAttempt.total} in ${formatTime(bestAttempt.timeTaken)})`}
            </p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-field px-4 py-3 text-center">
              <dt className="text-xs uppercase tracking-wide text-gray-400">{stat.label}</dt>
              <dd className={`mt-1 text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/quiz/${quiz.id}`}
            className="rounded-lg bg-brand px-5 py-2.5 text-center text-sm font-semibold transition hover:bg-brand-dark"
          >
            {isMine ? "Play again" : "Play this quiz"}
          </Link>
          <Link
            href={`/leaderboard/${quiz.id}`}
            className="rounded-lg border border-line px-5 py-2.5 text-center text-sm font-semibold text-gray-300 transition hover:bg-field hover:text-white"
          >
            View leaderboard
          </Link>
        </div>
      </section>

      {/* Review */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Review your answers</h2>
        <AnswerReview questions={quiz.questions} answers={attempt.answers} />
      </section>
    </div>
  );
}
