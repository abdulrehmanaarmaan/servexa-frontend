"use client";

import { getMyInvoices } from "@/services/invoice.service";
import { paymentService } from "@/services/payment.service";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Loader2,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const formatAmount = (amount: number | string) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getStatusClasses = (status: InvoiceStatus) => {
  switch (status) {
    case "PAID":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 backdrop-blur-md";

    case "ISSUED":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300 backdrop-blur-md";

    case "PARTIALLY_PAID":
      return "border-blue-400/30 bg-blue-400/10 text-blue-300 backdrop-blur-md";

    case "OVERDUE":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300 backdrop-blur-md";

    case "VOID":
      return "border-slate-500/30 bg-slate-500/10 text-slate-400 backdrop-blur-md";

    default:
      return "border-slate-400/30 bg-slate-400/10 text-slate-300 backdrop-blur-md";
  }
};

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="size-3.5" />;

    case "OVERDUE":
      return <AlertCircle className="size-3.5" />;

    case "ISSUED":
    case "PARTIALLY_PAID":
      return <Clock3 className="size-3.5" />;

    default:
      return <FileText className="size-3.5" />;
  }
};

interface InvoiceCardProps {
  invoice: Invoice;
  isPaying: boolean;
  onPay: (invoiceId: string) => void;
}

function InvoiceCard({ invoice, isPaying, onPay }: InvoiceCardProps) {
  const isPayable =
    invoice.status === "ISSUED" || invoice.status === "PARTIALLY_PAID";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-200 hover:border-teal-400/30 sm:p-6">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20 shadow-inner">
              <Receipt className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400">Invoice</p>

              <h2 className="mt-0.5 truncate text-base font-bold text-white sm:text-lg">
                {invoice.invoiceNumber}
              </h2>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
              invoice.status,
            )}`}
          >
            {getStatusIcon(invoice.status)}
            {invoice.status.replace("_", " ")}
          </span>
        </div>

        {/* Service */}
        <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md sm:p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
            Service
          </p>

          <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
            {invoice.workOrder?.service?.name ?? "Service unavailable"}
          </p>
        </div>

        {/* Amount details */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-lg border border-white/5 bg-slate-950/40 p-2.5 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
              Subtotal
            </p>

            <p className="mt-1 text-xs font-bold text-slate-200 sm:text-sm">
              {formatAmount(invoice.subtotal)}
            </p>
          </div>

          <div className="rounded-lg border border-white/5 bg-slate-950/40 p-2.5 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
              Tax
            </p>

            <p className="mt-1 text-xs font-bold text-slate-200 sm:text-sm">
              {formatAmount(invoice.tax)}
            </p>
          </div>

          <div className="rounded-lg border border-white/5 bg-slate-950/40 p-2.5 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
              Total
            </p>

            <p className="mt-1 text-xs font-black text-teal-400 sm:text-sm">
              {formatAmount(invoice.total)}
            </p>
          </div>

          <div className="rounded-lg border border-white/5 bg-slate-950/40 p-2.5 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="text-[10px] font-semibold text-slate-500 sm:text-xs">
              Due date
            </p>

            <p className="mt-1 text-xs font-bold text-slate-200 sm:text-sm">
              {formatDate(invoice.dueAt)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
              Issued
            </p>

            <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">
              {formatDate(invoice.issuedAt)}
            </p>
          </div>

          {isPayable && (
            <button
              type="button"
              disabled={isPaying}
              onClick={() => onPay(invoice.id)}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:w-auto sm:text-sm"
            >
              {isPaying ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Pay with bKash
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CustomerInvoicesClient() {
  const invoicesQuery = useQuery({
    queryKey: ["customer-invoices"],
    queryFn: () => getMyInvoices(),
  });

  const paymentMutation = useMutation({
    mutationFn: (invoiceId: string) =>
      paymentService.initiatePayment(invoiceId),

    onSuccess: (data) => {
      if (!data.paymentUrl) {
        toast.error("Payment URL was not returned by the server.");
        return;
      }

      window.location.href = data.paymentUrl;
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to initiate payment.",
      );
      console.log(error)
    },
  });

  const invoices = invoicesQuery.data?.data ?? [];
  if (invoicesQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`invoice-skeleton-${index}`}
            className="h-64 animate-pulse rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl"
          />
        ))}
      </div>
    );
  }

  if (invoicesQuery.isError) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 shadow-xl backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-400" />

          <div className="min-w-0">
            <h2 className="text-base font-bold text-white">
              Unable to load invoices
            </h2>

            <p className="mt-1 text-xs text-rose-200/90 sm:text-sm">
              {invoicesQuery.error instanceof Error
                ? invoicesQuery.error.message
                : "Something went wrong while loading your invoices."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
          <FileText className="size-6 text-teal-400" />
        </div>

        <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
          No invoices yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
          You do not have any invoices available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          isPaying={
            paymentMutation.isPending &&
            paymentMutation.variables === invoice.id
          }
          onPay={(invoiceId) => paymentMutation.mutate(invoiceId)}
        />
      ))}
    </div>
  );
}
