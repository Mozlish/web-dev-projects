import Image from "next/image";
import Modal from "./Modal";
import Rating from "./Rating";
import AddToCartButton from "./AddToCartButton";

export default function MovieDetailsModal({ movie, onClose }) {
  return (
    <Modal onClose={onClose} label={movie.title}>
      <div className="grid sm:grid-cols-[2fr_3fr]">
        <Image
          src={movie.cover}
          alt={`${movie.title} poster`}
          width={400}
          height={600}
          className="h-64 w-full object-cover object-top sm:h-full sm:rounded-l-2xl"
        />

        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {movie.year} · {movie.duration}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight">{movie.title}</h2>
          <p className="mb-3 mt-1 font-medium text-primary">{movie.genre}</p>
          <Rating value={movie.rating} />

          <p className="mt-5 leading-relaxed text-zinc-600 dark:text-zinc-300">
            {movie.description}
          </p>

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
            <AddToCartButton movie={movie} className="flex-1" />
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
