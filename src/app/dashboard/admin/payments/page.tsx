import { CreditCard } from "lucide-react";

import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";
import type { Payment } from "@/types/payment";

export default async function AdminPaymentsPage() {
  const payments = await serverApiFetch<Payment[]>(endpoints.admin.payments);

  return (
    <section className="space-y-6 text-slate-100">
      <div>
        <div className="flex items-center gap-2 text-teal-400">
          <CreditCard className="size-4 sm:size-5" />
          <span className="text-xs font-semibold tracking-wide sm:text-sm">
            Financial Operations
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Payments
        </h1>

        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
          View and monitor all payments across the platform.
        </p>
      </div>

      {payments.length === 0 ? (
        <Message
          icon={<CreditCard className="size-6 text-teal-400" />}
          message="No payment records found."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Payment</th>

                  <th className="px-5 py-3.5 font-semibold">Invoice</th>

                  <th className="px-5 py-3.5 font-semibold">Amount</th>

                  <th className="px-5 py-3.5 font-semibold">Provider</th>

                  <th className="px-5 py-3.5 font-semibold">Status</th>

                  <th className="px-5 py-3.5 font-semibold">Transaction</th>

                  <th className="px-5 py-3.5 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-mono text-xs font-bold text-white">
                      {payment.id.slice(0, 8)}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {payment.invoice?.workOrder?.id ?? "—"}
                        </p>

                        <p className="font-bold text-white">
                          {payment.invoice?.id.slice(0, 8) ??
                            "—"}
                        </p>

                        {payment.invoice?.status && (
                          <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                            {payment.invoice.status}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-bold text-white">
                      {payment.currency}{" "}
                      {Number(payment.amount).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-300">
                      {payment.provider}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
                        <span className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-slate-300">
                      {payment.transactionId ?? "—"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-slate-300">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function Message({
  message,
  icon,
}: {
  message: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
        {icon}
      </div>

      <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
        No payments found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
        {message}
      </p>
    </div>
  );
}
