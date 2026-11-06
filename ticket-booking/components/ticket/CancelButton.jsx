"use client";

import { useTransition } from "react";

// cancelAction = cancelBooking with this ticket's PNR already bound to it, on the server
export default function CancelButton({ cancelAction, refundText }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const message = `Cancel this ticket? You'll get ${refundText} back, and the seats go back on sale.`;
    if (!window.confirm(message)) return;

    startTransition(async () => {
      await cancelAction(); // no arguments: the PNR is already inside
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg border border-rose-500/50 px-5 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-wait disabled:opacity-60"
    >
      {isPending ? "Cancelling..." : "Cancel ticket"}
    </button>
  );
}
