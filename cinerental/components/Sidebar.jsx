import { CalendarClock, Clapperboard, Flame, Sparkles } from "lucide-react";
import { categories } from "@/data/movies";

// Which icon goes with which category id
const icons = {
  all: Clapperboard,
  trending: Flame,
  "new-releases": Sparkles,
  "coming-soon": CalendarClock,
};

export default function Sidebar({ activeCategory, onSelect }) {
  return (
    <aside className="lg:w-60 lg:shrink-0">
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:overflow-visible lg:pb-0">
        {categories.map((category) => {
          const Icon = icons[category.id];
          const isActive = category.id === activeCategory;

          return (
            <li key={category.id}>
              <button
                onClick={() => onSelect(category.id)}
                className={`flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-cine-dark shadow-lg shadow-primary/20"
                    : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {category.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
