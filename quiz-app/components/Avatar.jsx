import { getInitials } from "@/lib/quiz";

// Full class names, so Tailwind can find them
const colors = [
  "bg-emerald-600",
  "bg-sky-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-violet-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-fuchsia-600",
];

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

// Same name -> same colour, every time
function getColor(name) {
  let sum = 0;
  for (const letter of name) sum += letter.charCodeAt(0);
  return colors[sum % colors.length];
}

export default function Avatar({ name, size = "md", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${sizes[size]} ${getColor(name)} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
