// One question and its options. Real radio buttons, so the keyboard works:
// Tab into the group, arrow keys move between options.
export default function QuestionCard({ question, number, total, selected, onSelect }) {
  const headingId = `${question.id}-text`;

  return (
    <section className="rounded-2xl border border-line bg-card p-6 md:p-8">
      <p className="text-sm font-medium text-gray-400">
        Question {number} of {total}
      </p>
      <h2 id={headingId} className="mt-2 text-xl font-semibold md:text-2xl">
        {question.text}
      </h2>

      <div role="radiogroup" aria-labelledby={headingId} className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selected === option.id;

          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3.5 transition has-focus-visible:ring-2 has-focus-visible:ring-brand ${
                isSelected ? "border-brand bg-brand/10" : "border-line hover:bg-field"
              }`}
            >
              {/* The real input is hidden; the whole label is the clickable button */}
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold uppercase ${
                  isSelected ? "bg-brand text-white" : "bg-field text-gray-400"
                }`}
              >
                {option.id}
              </span>
              <span className="text-gray-100">{option.text}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
