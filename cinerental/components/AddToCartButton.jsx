"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Used on the movie card AND inside the details modal
export default function AddToCartButton({ movie, className = "" }) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(movie.id);

  if (inCart) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-semibold text-primary ${className}`}
      >
        <Check size={16} strokeWidth={3} />
        In Cart
      </button>
    );
  }

  return (
    <button
      onClick={() => addToCart(movie)}
      className={`flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-cine-dark transition hover:bg-primary-dark active:scale-[0.98] ${className}`}
    >
      <ShoppingCart size={16} strokeWidth={2.5} />
      ${movie.price} | Add to Cart
    </button>
  );
}
