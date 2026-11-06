// A circle that fills up to the score, drawn with SVG.
// The trick: a dashed stroke whose dash is as long as the whole circle,
// shifted back by the part we DON'T want to show.
export default function ScoreRing({ percent, ringClass }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // the length of the circle's edge
  const hidden = circumference * (1 - percent / 100);

  return (
    <div className="relative size-40 shrink-0">
      {/* -rotate-90 makes the ring start at the top instead of the right */}
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-field" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={hidden}
          className={ringClass}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-4xl font-bold tabular-nums">{percent}%</span>
      </div>
    </div>
  );
}
