import Link from "next/link";
import { AlertCircle, ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-100px] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 opacity-25 blur-[120px] [background:radial-gradient(circle_at_50%_50%,#2dd4bf_0%,transparent_70%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 size-100 rounded-full bg-teal-500/10 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 size-100 rounded-full bg-emerald-500/10 blur-[100px]"
        />

        {/* Main card */}
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-400/10 text-teal-400 ring-1 ring-teal-400/20 shadow-inner sm:size-20">
            <Compass className="size-8 animate-pulse sm:size-10" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
            <AlertCircle className="size-3.5 text-teal-400" />
            <span>404</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Page not found
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
            The page you're looking for doesn't exist or is no longer
            available.
          </p>

          {/* Action */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400 px-5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-10 sm:w-auto sm:text-sm"
              >
                <ArrowLeft className="size-4" />
                Back Home
              </Button>
            </Link>
          </div>

          {/* Footer text */}
          <div className="mt-8 flex items-center justify-center border-t border-white/5 pt-6">
            <span className="text-[11px] font-mono text-slate-500">
              Servexa Operational System
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}