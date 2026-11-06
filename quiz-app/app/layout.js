import { Geist } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  // %s is replaced by each page's own title: "JavaScript Basics | QuizArena"
  title: {
    template: "%s | QuizArena",
    default: "QuizArena | Quiz Application",
  },
  description: "Timed quizzes with a shared leaderboard, built with React and Next.js",
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-page font-sans text-white">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">{children}</main>
        <footer className="border-t border-line py-6 text-center text-sm text-gray-500">
          © {year} QuizArena. Built with React and Next.js.
        </footer>
      </body>
    </html>
  );
}
