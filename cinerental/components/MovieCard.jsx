"use client";

import { useState } from "react";
import Image from "next/image";
import Rating from "./Rating";
import AddToCartButton from "./AddToCartButton";
import MovieDetailsModal from "./MovieDetailsModal";

export default function MovieCard({ movie }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <figure className="group flex flex-col rounded-2xl border border-black/5 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-cine-card">
        <button
          onClick={() => setShowDetails(true)}
          className="block overflow-hidden rounded-xl"
          aria-label={`View details for ${movie.title}`}
        >
          <Image
            src={movie.cover}
            alt={`${movie.title} poster`}
            width={400}
            height={600}
            className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </button>

        <figcaption className="flex flex-1 flex-col px-1 pt-4">
          <button
            onClick={() => setShowDetails(true)}
            className="text-left text-lg font-bold leading-tight hover:text-primary"
          >
            {movie.title}
          </button>
          <p className="mb-2 mt-1 text-sm text-zinc-500 dark:text-zinc-400">{movie.genre}</p>
          <Rating value={movie.rating} />
          <AddToCartButton movie={movie} className="mt-4 w-full" />
        </figcaption>
      </figure>

      {showDetails && (
        <MovieDetailsModal movie={movie} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}
