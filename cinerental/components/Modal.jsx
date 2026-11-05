"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// A reusable popup. Both the movie details and the cart use it.
export default function Modal({ onClose, label, maxWidth = "max-w-4xl", children }) {
  useEffect(() => {
    // Close on Escape key
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    // Stop the page behind the modal from scrolling
    document.body.style.overflow = "hidden";

    // Cleanup: runs when the modal closes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // createPortal renders the modal directly inside <body>,
  // so parent styles (like the header's blur) can't trap it.
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()} // clicks inside don't close it
        className={`relative max-h-[90vh] w-full ${maxWidth} animate-pop-in overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-cine-card`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
