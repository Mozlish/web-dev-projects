// A labelled input with an error (or a hint) underneath.
// Any other prop (type, required, defaultValue ...) is passed straight to the <input>.
export default function Field({ label, error, hint, className = "", ...inputProps }) {
  const id = inputProps.id ?? inputProps.name;
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`mt-1.5 w-full rounded-lg bg-field px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 ${
          error ? "ring-2 ring-rose-500/70 focus:ring-rose-500" : "focus:ring-brand"
        }`}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className={`mt-1.5 text-sm ${error ? "text-rose-400" : "text-gray-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
