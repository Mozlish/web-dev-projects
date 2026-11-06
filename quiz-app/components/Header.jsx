import Link from "next/link";
import { leaveQuiz } from "@/app/actions";
import { getCurrentParticipant } from "@/lib/participant";
import Avatar from "./Avatar";
import NavLink from "./NavLink";

// An async Server Component: it reads the cookie before it renders
export default async function Header() {
  const participant = await getCurrentParticipant();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Logo: a tick in a box + the app name */}
          <Link href="/" className="mr-2 flex items-center gap-2 text-lg font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-brand">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            {/* sr-only: hidden on phones, but screen readers still get the link's name */}
            <span className="sr-only sm:not-sr-only">QuizArena</span>
          </Link>

          <NavLink href="/">Quizzes</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </div>

        {participant ? (
          <div className="flex items-center gap-3">
            {/* Phones only have room for the button: the avatar shows from sm (640px),
                the name from md (768px), cut short with "..." if it's long */}
            <Avatar name={participant.name} size="sm" className="max-sm:hidden" />
            <span className="hidden max-w-40 truncate text-sm md:block">{participant.name}</span>
            {/* A form can call a Server Action without any client JavaScript */}
            <form action={leaveQuiz}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 text-sm whitespace-nowrap text-gray-300 transition hover:bg-field hover:text-white"
              >
                Switch<span className="hidden sm:inline"> player</span>
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/join"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold transition hover:bg-brand-dark"
          >
            Join<span className="hidden sm:inline"> to play</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
