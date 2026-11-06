import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard, getQuizList } from "@/lib/data";
import { getCurrentParticipant } from "@/lib/participant";
import { formatTime, getPercent } from "@/lib/quiz";
import Avatar from "@/components/Avatar";

// Gold, silver, bronze for the top three ranks (full class names for Tailwind)
const rankStyles = {
  1: "bg-amber-400 text-gray-950",
  2: "bg-gray-300 text-gray-950",
  3: "bg-orange-400 text-gray-950",
};

function RankBadge({ rank }) {
  return (
    <span
      className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
        rankStyles[rank] ?? "bg-field text-gray-300"
      }`}
    >
      {rank}
    </span>
  );
}

export async function generateMetadata({ params }) {
  const { quizId } = await params;
  const board = await getLeaderboard(quizId);
  return { title: board ? `${board.quiz.title} leaderboard` : "Leaderboard not found" };
}

// Page 4: who did best on one quiz, at "/leaderboard/[quizId]"
export default async function LeaderboardPage({ params }) {
  const { quizId } = await params;
  const [board, quizzes, viewer] = await Promise.all([
    getLeaderboard(quizId),
    getQuizList(),
    getCurrentParticipant(),
  ]);

  if (!board) notFound();

  const { quiz, rows } = board;
  const myRow = rows.find((row) => row.attempt.participantId === viewer?.id);
  const podium = rows.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-gray-400">
          Best attempt per player. Same score? The faster time wins.
        </p>
      </div>

      {/* Tabs: one link per quiz. The current quizId decides which one is active */}
      <nav aria-label="Choose a quiz" className="flex gap-2 overflow-x-auto pb-1">
        {quizzes.map((item) => {
          const isActive = item.id === quiz.id;
          return (
            <Link
              key={item.id}
              href={`/leaderboard/${item.id}`}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-white text-gray-950" : "bg-card text-gray-400 hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Where am I? */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-card p-5 sm:flex-row sm:items-center">
        <p className="text-gray-300">
          {myRow
            ? `You're #${myRow.rank} of ${rows.length} with ${myRow.attempt.score}/${myRow.attempt.total} in ${formatTime(myRow.attempt.timeTaken)}.`
            : viewer
              ? "You haven't played this quiz yet."
              : "Join to see your name on this board."}
        </p>
        <Link
          href={`/quiz/${quiz.id}`}
          className="shrink-0 rounded-lg bg-brand px-5 py-2.5 text-center text-sm font-semibold transition hover:bg-brand-dark"
        >
          {myRow ? "Beat your score" : "Play now"}
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line py-16 text-center text-gray-400">
          Nobody has played {quiz.title} yet. Be the first!
        </p>
      ) : (
        <>
          {/* Podium: the top three as cards */}
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Top three">
            {podium.map((row) => (
              <div
                key={row.attempt.id}
                className={`rounded-2xl border bg-card p-5 ${
                  row.rank === 1 ? "border-amber-400/60" : "border-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <RankBadge rank={row.rank} />
                  <span className="text-sm text-gray-400 tabular-nums">{formatTime(row.attempt.timeTaken)}</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={row.participant.name} />
                  <p className="min-w-0 truncate font-semibold">{row.participant.name}</p>
                </div>
                <p className="mt-4 text-3xl font-bold tabular-nums">
                  {row.attempt.score}
                  <span className="text-lg text-gray-500">/{row.attempt.total}</span>
                </p>
              </div>
            ))}
          </section>

          {/* Everyone */}
          <div className="overflow-x-auto rounded-2xl border border-line bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Rank</th>
                  <th scope="col" className="px-5 py-3 font-medium">Player</th>
                  <th scope="col" className="px-5 py-3 font-medium">Score</th>
                  <th scope="col" className="px-5 py-3 font-medium">Time</th>
                  <th scope="col" className="hidden px-5 py-3 font-medium sm:table-cell">Plays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => {
                  const isMe = row.attempt.participantId === viewer?.id;
                  const percent = getPercent(row.attempt.score, row.attempt.total);

                  return (
                    <tr key={row.attempt.id} className={isMe ? "bg-brand/10" : ""}>
                      <td className="px-5 py-3">
                        <RankBadge rank={row.rank} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={row.participant.name} size="sm" />
                          <span className="font-medium whitespace-nowrap">{row.participant.name}</span>
                          {isMe && (
                            <span className="rounded-full bg-brand/25 px-2 py-0.5 text-xs font-semibold text-violet-200">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap tabular-nums">
                        <span className="font-semibold">
                          {row.attempt.score}/{row.attempt.total}
                        </span>{" "}
                        <span className="text-gray-500">{percent}%</span>
                      </td>
                      <td className="px-5 py-3 tabular-nums">{formatTime(row.attempt.timeTaken)}</td>
                      <td className="hidden px-5 py-3 text-gray-400 sm:table-cell">{row.plays}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
