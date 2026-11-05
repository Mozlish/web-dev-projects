"use client";

import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";

// Toasts follow the current theme, so they need to read ThemeContext
function Toasts() {
  const { darkMode } = useTheme();
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2500}
      theme={darkMode ? "dark" : "light"}
    />
  );
}

// One wrapper for every provider, so layout.js stays clean
export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <Toasts />
      </CartProvider>
    </ThemeProvider>
  );
}
