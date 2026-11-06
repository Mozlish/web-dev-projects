"use client";

// window only exists in the browser, so this tiny button is a Client Component
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-brand-dark"
    >
      Print or save as PDF
    </button>
  );
}
