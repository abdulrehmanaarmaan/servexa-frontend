"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-96 rounded-full bg-rose-500/10 blur-3xl opacity-20"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/30 border-t-rose-400/60 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20 shadow-inner sm:size-20">
          <AlertTriangle className="size-8 sm:size-10" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
          We couldn't complete this request. Please try again.
        </p>

        <div className="mt-8">
          <Button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400 px-5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-10 sm:text-sm"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        </div>
      </div>
    </main>
  );
}