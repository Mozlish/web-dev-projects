"use client";

import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";
import { cartReducer, initialCartState } from "@/reducers/cartReducer";

// 1. Create the context (an empty "box" that components can read from)
const CartContext = createContext(null);

// 2. The Provider owns the cart state and shares it with every child
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  function isInCart(movieId) {
    return state.items.some((item) => item.id === movieId);
  }

  function addToCart(movie) {
    if (isInCart(movie.id)) {
      toast.error(`"${movie.title}" is already in your cart`);
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: movie });
    toast.success(`"${movie.title}" added to cart`);
  }

  function removeFromCart(movie) {
    dispatch({ type: "REMOVE_FROM_CART", payload: movie });
    toast.info(`"${movie.title}" removed from cart`);
  }

  function checkout() {
    const count = state.items.length;
    dispatch({ type: "CLEAR_CART" });
    toast.success(`Rented ${count} movie${count > 1 ? "s" : ""}. Enjoy the show! 🍿`);
  }

  // Derived value — calculated from state, so we don't store it separately
  const totalPrice = state.items.reduce((sum, item) => sum + item.price, 0);

  const value = {
    cartItems: state.items,
    totalPrice,
    isInCart,
    addToCart,
    removeFromCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 3. A small custom hook so components can just write: const { addToCart } = useCart()
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
