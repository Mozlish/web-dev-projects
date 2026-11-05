import Image from "next/image";
import { Popcorn, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Modal from "./Modal";

export default function CartModal({ onClose }) {
  const { cartItems, totalPrice, removeFromCart, checkout } = useCart();

  function handleCheckout() {
    checkout();
    onClose();
  }

  return (
    <Modal onClose={onClose} label="Your cart" maxWidth="max-w-2xl">
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-extrabold">Your Cart</h2>

        {cartItems.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center py-10 text-center">
            <span className="mb-4 grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
              <Popcorn size={30} />
            </span>
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Pick a movie and grab the popcorn.
            </p>
          </div>
        ) : (
          <>
            <ul className="max-h-[50vh] divide-y divide-black/5 overflow-y-auto pr-1 dark:divide-white/5">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <Image
                    src={item.cover}
                    alt={`${item.title} poster`}
                    width={56}
                    height={84}
                    className="h-[84px] w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.genre}</p>
                    <p className="mt-1 font-semibold text-primary">${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item)}
                    aria-label={`Remove ${item.title}`}
                    className="grid size-10 place-items-center rounded-lg bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
              <span className="text-zinc-500 dark:text-zinc-400">
                Total ({cartItems.length} {cartItems.length === 1 ? "movie" : "movies"})
              </span>
              <span className="text-2xl font-extrabold">${totalPrice}</span>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-cine-dark transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Checkout
          </button>
        </div>
      </div>
    </Modal>
  );
}
