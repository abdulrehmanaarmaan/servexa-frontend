import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";
import { Lock, ShieldCheck, Zap } from "lucide-react";

export default function RegisterPage() {
  return (
   <main className="relative grid min-h-screen place-items-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-teal-500 selection:text-slate-950 overflow-hidden">
      {/* Background Ambient Glows - Shared Design Language */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[130px] [background:radial-gradient(circle_at_50%_50%,#2dd4bf_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[450px] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 -z-10 size-[450px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="w-full max-w-xl">
        {/* Top Brand Link / Header Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-2xl font-black tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-400/10 ring-1 ring-teal-400/30 shadow-inner shadow-teal-500/10 transition-all group-hover:bg-teal-400/20">
              <Zap className="size-5 text-teal-400" />
            </div>
            <span>
              Serve<span className="text-teal-400">xa</span>
            </span>
          </Link>
        </div>

        {/* Main Glassmorphic Auth Card */}
        <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all">
          <div className="mb-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold text-teal-300 shadow-inner shadow-teal-500/10">
              <ShieldCheck className="size-3.5 text-teal-400" />
              <p className="text-sm font-semibold text-teal-400">
                Get started
              </p>
            </div>

            {/* Headline */}
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Create your Servexa account
            </h1>
          </div>

          {/* Form Injection */}
          <div className="relative">
            <RegisterForm />
          </div>

          {/* Footer Navigation Link */}
          <p className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-teal-400 transition-colors hover:text-teal-300 hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security / RBAC Footer Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <Lock className="size-3.5 text-slate-500" />
          <span>Protected by Servexa RBAC Security Engine</span>
        </div>
      </div>
    </main>
  );
}