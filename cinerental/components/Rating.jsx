import { Star } from "lucide-react";

// Shows 5 stars, filling in as many as the rating
export default function Rating({ value, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          size={15}
          className={
            index < value
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-300 dark:text-zinc-600"
          }
        />
      ))}
    </div>
  );
}
