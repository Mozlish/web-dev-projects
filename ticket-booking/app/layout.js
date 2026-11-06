import { Geist } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  // %s is replaced by each page's own title: "My tickets | RailGo"
  title: {
    template: "%s | RailGo",
    default: "RailGo | Railway Ticket Booking",
  },
  description: "Effortless railway ticket booking at your fingertips, built with React and Next.js",
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-page font-sans text-white print:bg-white print:text-gray-900">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12 print:p-0">{children}</main>
        <footer className="border-t border-line py-6 text-center text-sm text-gray-500 print:hidden">
          © {year} RailGo. A practice project built with React and Next.js. Times and fares are sample data.
        </footer>
      </body>
    </html>
  );
}
