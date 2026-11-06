"use client";

import { useFormStatus } from "react-dom";

// A submit button that knows when its form is busy.
// useFormStatus only works in a component placed INSIDE a <form>.
export default function SubmitButton({ children, pendingText = "Saving...", className = "" }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
