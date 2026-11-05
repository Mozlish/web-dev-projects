export default function Footer() {
  return (
    <footer className="mt-10 border-t border-black/5 py-8 text-center text-sm text-zinc-500 dark:border-white/5 dark:text-zinc-400">
      © {new Date().getFullYear()} CineRental · Built with Next.js
    </footer>
  );
}
