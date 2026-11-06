import { formatTime } from "@/lib/quiz";

export default function QuizSidebar({
  playerName,
  secondsLeft,
  timeLimit,
  questions,
  answers,
  currentIndex,
  onJump,
  onSubmit,
  isSubmitting,
}) {
  const answeredCount = Object.keys(answers).length;
  const isLow = secondsLeft <= 30; // the last 30 seconds turn red
  const timePercent = (secondsLeft / timeLimit) * 100;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      {/* The timer */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <p className="text-sm text-gray-400">Time left</p>
        <p
          role="timer"
          className={`mt-1 text-4xl font-bold tabular-nums ${isLow ? "text-rose-400" : "text-white"}`}
        >
          {formatTime(secondsLeft)}
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-field">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              isLow ? "bg-rose-500" : "bg-brand"
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </div>

      {/* Progress and the question grid */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <p className="text-sm text-gray-400">
          Playing as <span className="font-medium text-white">{playerName}</span>
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Answered{" "}
          <span className="font-semibold text-white">
            {answeredCount} of {questions.length}
          </span>
        </p>

        <ol className="mt-4 grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isAnswered = answers[question.id] !== undefined;
            const isCurrent = index === currentIndex;

            return (
              <li key={question.id}>
                <button
                  type="button"
                  onClick={() => onJump(index)}
                  aria-label={`Question ${index + 1}${isAnswered ? ", answered" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`grid aspect-square w-full place-items-center rounded-lg text-sm font-semibold transition ${
                    isAnswered ? "bg-brand text-white" : "bg-field text-gray-400 hover:text-white"
                  } ${isCurrent ? "ring-2 ring-white ring-offset-2 ring-offset-card" : ""}`}
                >
                  {index + 1}
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-5 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit quiz"}
        </button>
      </div>
    </aside>
  );
}
