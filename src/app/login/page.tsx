import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Agent Hub administration.",
};

export default function LoginPage() {
  return (
    <div className="bg-mesh flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          Agent Hub
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Static design
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="ah-animate-in w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
