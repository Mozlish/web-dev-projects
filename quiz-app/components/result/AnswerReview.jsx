// Every question with the right answer, the player's answer and why
const statusStyles = {
  correct: { label: "Correct", badge: "bg-emerald-500/15 text-emerald-300" },
  wrong: { label: "Wrong", badge: "bg-rose-500/15 text-rose-300" },
  skipped: { label: "Skipped", badge: "bg-field text-gray-400" },
};

function getStatus(question, picked) {
  if (!picked) return "skipped";
  return picked === question.answer ? "correct" : "wrong";
}

export default function AnswerReview({ questions, answers }) {
  return (
    <ol className="space-y-4">
      {questions.map((question, index) => {
        const picked = answers[question.id];
        const status = statusStyles[getStatus(question, picked)];

        return (
          <li key={question.id} className="rounded-2xl border border-line bg-card p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold">
                <span className="mr-2 text-gray-500">{index + 1}.</span>
                {question.text}
              </h3>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.badge}`}>
                {status.label}
              </span>
            </div>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {question.options.map((option) => {
                const isAnswer = option.id === question.answer;
                const isPicked = option.id === picked;

                let style = "border-line text-gray-400";
                if (isAnswer) style = "border-emerald-500/60 bg-emerald-500/10 text-emerald-100";
                else if (isPicked) style = "border-rose-500/60 bg-rose-500/10 text-rose-100";

                return (
                  <li key={option.id} className={`rounded-lg border px-3 py-2.5 text-sm ${style}`}>
                    <span className="mr-2 font-bold uppercase">{option.id}</span>
                    {option.text}
                    {(isAnswer || isPicked) && (
                      <span className="mt-1 block text-xs opacity-80">
                        {isAnswer && isPicked && "✓ Your answer"}
                        {isAnswer && !isPicked && "✓ Correct answer"}
                        {!isAnswer && isPicked && "✗ Your answer"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 rounded-lg bg-field px-4 py-3 text-sm text-gray-300">
              <span className="font-semibold text-white">Why: </span>
              {question.explanation}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
