"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A Link that looks active on its own section: "/tickets" stays active on "/tickets/RG4K..."
export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" || pathname.startsWith("/search") : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
        isActive ? "bg-field text-white" : "text-gray-400 hover:bg-field hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
