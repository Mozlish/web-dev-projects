import Header from "@/components/Header";
import MovieBrowser from "@/components/MovieBrowser";
import Footer from "@/components/Footer";
import { movies } from "@/data/movies";

// This is a SERVER component (no "use client").
// It reads the data and passes it down to the interactive parts as props.
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <MovieBrowser movies={movies} />
      </main>
      <Footer />
    </>
  );
}
