import { Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: "CineRental — Rent Movies Online",
  description: "Your one-stop app for movie magic and rentals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${manrope.variable} antialiased`}>
      <body className="min-h-screen bg-cine-light font-sans text-zinc-900 transition-colors duration-300 dark:bg-cine-dark dark:text-zinc-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
