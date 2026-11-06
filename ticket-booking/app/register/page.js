import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create an account",
};

export default async function RegisterPage({ searchParams }) {
  const { next = "/" } = await searchParams;

  if (await getCurrentUser()) redirect("/");

  return (
    <div className="mx-auto max-w-md py-6 md:py-12">
      <div className="rounded-2xl border border-line bg-card p-6 md:p-8">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-gray-400">One account for every trip. It takes a minute.</p>

        <div className="mt-8">
          <RegisterForm nextPath={next} />
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
