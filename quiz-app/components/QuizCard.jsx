import Link from "next/link";
import { formatTime, getPercent, quizThemes } from "@/lib/quiz";

export default function QuizCard({ quiz }) {
  const theme = quizThemes[quiz.color];
  const { myBest } = quiz;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition hover:border-gray-600">
      {/* Cover: a soft gradient with the topic in big letters */}
      <div className={`relative h-36 bg-linear-to-br ${theme.cover}`}>
        <span className={`absolute bottom-3 left-5 text-5xl font-black tracking-tight ${theme.text}`}>
          {quiz.topic}
        </span>
        {myBest && (
          <span className="absolute top-4 right-4 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            Played
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-xl font-semibold">{quiz.title}</h2>
        <p className="mt-1 text-sm text-gray-400">{quiz.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2 text-xs">
          <li className={`rounded-full px-2.5 py-1 ${theme.badge}`}>{quiz.level}</li>
          <li className="rounded-full bg-field px-2.5 py-1 text-gray-300">{quiz.questionCount} questions</li>
          <li className="rounded-full bg-field px-2.5 py-1 text-gray-300">{formatTime(quiz.timeLimit)} min</li>
        </ul>

        {/* mt-auto pushes the footer to the bottom, so every card lines up */}
        <div className="mt-auto pt-6">
          <p className="mb-3 text-sm text-gray-400">
            {myBest ? (
              <>
                Your best:{" "}
                <span className="font-semibold text-white">
                  {myBest.score}/{myBest.total}
                </span>{" "}
                ({getPercent(myBest.score, myBest.total)}%)
              </>
            ) : (
              `${quiz.playerCount} ${quiz.playerCount === 1 ? "player" : "players"} so far`
            )}
          </p>

          <div className="flex gap-2">
            <Link
              href={`/quiz/${quiz.id}`}
              className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-brand-dark"
            >
              {myBest ? "Play again" : "Start quiz"}
            </Link>
            <Link
              href={`/leaderboard/${quiz.id}`}
              className="rounded-lg border border-line px-4 py-2.5 text-sm text-gray-300 transition hover:bg-field hover:text-white"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
