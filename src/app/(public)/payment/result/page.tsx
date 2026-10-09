import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface PaymentResultPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function PaymentResultPage({
  searchParams,
}: PaymentResultPageProps) {
  const { status } = await searchParams;

  const isSuccess = status === "success";

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 selection:bg-teal-500 selection:text-slate-950 sm:px-6">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute size-96 rounded-full blur-3xl opacity-20 ${
          isSuccess ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />

      {/* Result card */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border bg-slate-900/80 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10 ${
          isSuccess
            ? "border-emerald-500/30 border-t-emerald-400/60"
            : "border-rose-500/30 border-t-rose-400/60"
        }`}
      >
        {/* Status icon */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          {isSuccess ? (
            <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 shadow-inner sm:size-20">
              <CheckCircle2 className="size-8 sm:size-10" />
            </div>
          ) : (
            <div className="flex size-16 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20 shadow-inner sm:size-20">
              <XCircle className="size-8 sm:size-10" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          {isSuccess
            ? "Payment Successful"
            : "Payment Unsuccessful"}
        </h1>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
          {isSuccess
            ? "Your payment has been successfully completed."
            : "Your payment could not be completed."}
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/customer/invoices"
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-10 sm:text-sm"
          >
            View My Invoices

            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/dashboard/customer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-700 active:scale-[0.98] sm:h-10 sm:text-sm"
          >
            <LayoutDashboard className="size-4 text-slate-400" />

            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}