"use client";

import { useState } from "react";
import { categories } from "@/data/movies";
import Sidebar from "./Sidebar";
import MovieList from "./MovieList";

// Holds the "which category is selected" state.
// Sidebar CHANGES it, MovieList USES it — so the state lives in their shared parent.
export default function MovieBrowser({ movies }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleMovies =
    activeCategory === "all"
      ? movies
      : movies.filter((movie) => movie.categories.includes(activeCategory));

  const heading = categories.find((c) => c.id === activeCategory).label;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      <Sidebar activeCategory={activeCategory} onSelect={setActiveCategory} />

      <section className="flex-1">
        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight">{heading}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {visibleMovies.length} movies
          </p>
        </div>
        <MovieList movies={visibleMovies} />
      </section>
    </div>
  );
}
