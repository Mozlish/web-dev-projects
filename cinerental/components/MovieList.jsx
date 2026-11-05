import MovieCard from "./MovieCard";

export default function MovieList({ movies }) {
  if (movies.length === 0) {
    return <p className="py-20 text-center text-zinc-500">No movies here yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
