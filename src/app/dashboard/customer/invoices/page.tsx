import CustomerInvoicesClient from "@/components/customer/CustomerInvoicesClient";
import { CreditCard, FileText } from "lucide-react";

export default function CustomerInvoicesPage() {
  return (
    <div className="space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal-400">
            <FileText className="size-4 sm:size-5" />

            <span className="text-xs font-semibold tracking-wide sm:text-sm">
              Billing & Payments
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            My Invoices
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            View your service invoices and securely complete outstanding
            payments through bKash.
          </p>
        </div>

        <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20 shadow-inner sm:flex">
          <CreditCard className="size-5" />
        </div>
      </div>

      {/* Invoices */}
      <CustomerInvoicesClient />
    </div>
  );
}
