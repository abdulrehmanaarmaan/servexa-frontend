import { unstable_rethrow } from "next/navigation";
import { CreditCard } from "lucide-react";

import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";
import type { Payment, PaymentStatus } from "@/types/payment";

// This page depends on the user's cookies, so it is always rendered on demand
export const dynamic = "force-dynamic";

const statusLabels: Record<PaymentStatus, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
};

export default async function CustomerPaymentsPage() {
    let payments: Payment[] | null = null;

    try {
        payments = await serverApiFetch<Payment[]>(
            endpoints.payments.myPayments,
        );

    } catch (error) {
        // Let Next.js internal errors (dynamic usage, redirect, notFound) through
        unstable_rethrow(error);

        console.error("Failed to load payments:", error);
    }

    return (
        <section className="space-y-6 text-slate-100">
            <div>
                <div className="flex items-center gap-2 text-teal-400">
                    <CreditCard className="size-4 sm:size-5" />
                    <span className="text-xs font-semibold tracking-wide sm:text-sm">
                        Financial History
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Payments
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                    View your payment history.
                </p>
            </div>

            {payments === null ? (
                <Message
                    icon={<CreditCard className="size-6 text-red-400" />}
                    message="Failed to load your payment history."
                />
            ) : payments.length === 0 ? (
                <Message
                    icon={<CreditCard className="size-6 text-teal-400" />}
                    message="No payment history found."
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
                                <tr>
                                    <th className="px-6 py-3.5 font-semibold">
                                        Payment
                                    </th>

                                    <th className="px-6 py-3.5 font-semibold">
                                        Invoice
                                    </th>

                                    <th className="px-6 py-3.5 font-semibold">
                                        Amount
                                    </th>

                                    <th className="px-6 py-3.5 font-semibold">
                                        Provider
                                    </th>

                                    <th className="px-6 py-3.5 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-3.5 font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {payments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="transition-colors hover:bg-white/5"
                                    >
                                        <td className="px-6 py-4 font-mono font-medium text-white">
                                            {payment.id.slice(0, 8)}
                                        </td>

                                        <td className="px-6 py-4 font-mono text-slate-300">
                                            {payment.invoice?.id
                                                ? payment.invoice.id.slice(0, 8)
                                                : "—"}
                                        </td>

                                        <td className="px-6 py-4 font-bold text-white">
                                            {payment.currency}{" "}
                                            {Number(
                                                payment.amount,
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4 text-slate-300">
                                            {payment.provider}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
                                                <span className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
                                                {statusLabels[payment.status] ??
                                                    payment.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                            {new Date(
                                                payment.createdAt,
                                            ).toLocaleDateString()}
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
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                {icon}
            </div>

            <p className="mt-4 text-sm sm:text-base font-bold text-white">
                {message}
            </p>
        </div>
    );
}