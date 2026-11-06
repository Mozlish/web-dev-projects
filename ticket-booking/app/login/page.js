import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in",
};

// /login or /login?next=/tickets
export default async function LoginPage({ searchParams }) {
  const { next = "/" } = await searchParams;

  // Already logged in? Nothing to do here
  if (await getCurrentUser()) redirect("/");

  return (
    <div className="mx-auto max-w-md py-6 md:py-12">
      <div className="rounded-2xl border border-line bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-gray-400">Log in to book seats and see your tickets.</p>

        <div className="mt-8">
          <LoginForm nextPath={next} />
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          New to RailGo?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="font-semibold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-3 text-center text-sm text-gray-400">
        Demo account: <span className="font-medium text-white">demo@railgo.test</span> /{" "}
        <span className="font-medium text-white">railgo123</span>
      </p>
    </div>
  );
}
