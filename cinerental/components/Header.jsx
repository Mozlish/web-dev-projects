"use client";

import { useState } from "react";
import Link from "next/link";
import { Clapperboard, Moon, ShoppingCart, Sun } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import CartModal from "./CartModal";

const iconButton =
  "relative grid size-11 place-items-center rounded-xl bg-primary/15 text-primary transition hover:bg-primary/25";

export default function Header() {
  const [showCart, setShowCart] = useState(false);
  const { cartItems } = useCart();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cine-light/90 backdrop-blur-md dark:border-white/5 dark:bg-cine-dark/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-cine-dark">
            <Clapperboard size={22} strokeWidth={2.4} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            Cine<span className="text-primary">Rental</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={iconButton}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setShowCart(true)}
            className={iconButton}
            aria-label={`Open cart (${cartItems.length} items)`}
          >
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-primary text-xs font-bold text-cine-dark">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </header>
  );
}
