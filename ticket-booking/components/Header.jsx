import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import NavLink from "./NavLink";

// "Rafi Ahmed" -> "RA"
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// An async Server Component: it checks the session cookie before it renders
export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/80 backdrop-blur print:hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Logo: a train front in a rounded square + the app name */}
          <Link href="/" className="mr-2 flex items-center gap-2 text-lg font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-gray-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <rect x="5" y="3" width="14" height="13" rx="3" />
                <path d="M5 10h14M9 20l-2 2M15 20l2 2M8.5 13h.01M15.5 13h.01" />
              </svg>
            </span>
            {/* sr-only: hidden on phones, but screen readers still get the link's name */}
            <span className="sr-only sm:not-sr-only">RailGo</span>
          </Link>

          <NavLink href="/">Book</NavLink>
          <NavLink href="/tickets">My tickets</NavLink>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-field text-xs font-semibold text-brand max-sm:hidden"
            >
              {getInitials(user.name)}
            </span>
            <span className="hidden max-w-40 truncate text-sm md:block">{user.name}</span>
            {/* A form can call a Server Action without any client JavaScript */}
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 text-sm whitespace-nowrap text-gray-300 transition hover:bg-field hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-300 transition hover:bg-field hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold whitespace-nowrap text-gray-950 transition hover:bg-brand-dark max-sm:hidden"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
