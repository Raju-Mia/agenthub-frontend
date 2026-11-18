import Link from "next/link";
import { buttonVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

export function LandingHero() {
  return (
    <section className="landing-hero relative flex min-h-svh flex-col overflow-hidden text-slate-100">
      {/* Dominant visual plane — lock device silhouette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-[4%] md:pr-[8%]"
      >
        <div className="ah-lock-pulse relative h-[min(78vh,640px)] w-[min(42vw,360px)]">
          <div className="absolute inset-0 rounded-[2.5rem] border border-teal-400/25 bg-gradient-to-b from-slate-800/80 to-slate-950/90 shadow-[0_0_80px_rgba(15,118,110,0.25)]" />
          <div className="absolute inset-x-10 top-10 bottom-16 rounded-3xl border border-white/10 bg-slate-950/80 overflow-hidden">
            <div className="ah-scan-line absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-teal-400/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/40 bg-teal-500/10">
                <LockGlyph className="h-8 w-8 text-teal-300" />
              </div>
              <div className="h-2 w-24 rounded-full bg-teal-500/40" />
              <div className="h-2 w-16 rounded-full bg-white/10" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-teal-300/70">
                Device locked
              </p>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16">
        <header className="ah-animate-in flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-teal-300/80">
            Lock administration
          </span>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-white/20 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white",
            )}
          >
            Login
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center max-w-xl pb-16 pt-20 lg:max-w-2xl">
          <p className="ah-animate-in ah-delay-1 font-display text-6xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Agent Hub
          </p>
          <h1 className="ah-animate-in ah-delay-2 mt-6 max-w-lg text-xl font-medium leading-snug text-slate-200 sm:text-2xl">
            Welcome to Agent Hub
          </h1>
          <p className="ah-animate-in ah-delay-3 mt-4 max-w-md text-base leading-relaxed text-slate-400">
            Administer Lock App devices, agents, workers, and earnings — from
            lock status to approved payouts.
          </p>
          <div className="ah-animate-in ah-delay-4 mt-10">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-teal-600 text-white hover:bg-teal-500 shadow-[0_0_40px_rgba(13,148,136,0.35)]",
              )}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LockGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="16" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}
