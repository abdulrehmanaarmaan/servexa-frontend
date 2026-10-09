import { getAdminInvoicesServer } from "@/services/invoice.server.service";
import { InvoiceStatus } from "@/types/invoice";
import {InvoiceQueryParams} from "@/types/invoice";
import { ChevronLeft, ChevronRight, CreditCard, FileText } from "lucide-react";

interface AdminInvoicesPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function AdminInvoicesPage({
    searchParams,
}: AdminInvoicesPageProps) {
    const params = await searchParams;

    const page = Math.max(
        1,
        Number(params.page) || 1,
    );

    const result = await getAdminInvoicesServer({
        page,
        limit: 10,
        status: params.status as InvoiceStatus,
        sortBy: params.sortBy as InvoiceQueryParams["sortBy"],
        sortOrder: params.sortOrder as InvoiceQueryParams["sortOrder"],
    });

    const invoices = result.data;
    const meta = result.meta;

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
                    Invoices
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Manage customer invoices.
                </p>
            </div>

            {invoices.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                        <FileText className="size-6 text-teal-400" />
                    </div>

                    <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                        No invoices found
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
                        No invoices found.
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
                                    <tr>
                                        <th className="px-5 py-3.5 font-semibold">
                                            Invoice
                                        </th>

                                        <th className="px-5 py-3.5 font-semibold">
                                            Work Order
                                        </th>

                                        <th className="px-5 py-3.5 font-semibold">
                                            Total
                                        </th>

                                        <th className="px-5 py-3.5 font-semibold">
                                            Status
                                        </th>

                                        <th className="px-5 py-3.5 font-semibold">
                                            Issued
                                        </th>

                                        <th className="px-5 py-3.5 font-semibold">
                                            Due
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/10">
                                    {invoices.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="transition-colors hover:bg-white/5"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-white">
                                                    {invoice.invoiceNumber}
                                                </div>

                                                <div className="mt-1 font-mono text-[10px] text-slate-400">
                                                    {invoice.id.slice(0, 8)}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {invoice.workOrder?.id ? (
                                                    <span className="font-mono text-xs font-medium text-slate-300">
                                                        {invoice.workOrder.id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500">—</span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 font-bold text-white">
                                                BDT{" "}
                                                {Number(
                                                    invoice.total,
                                                ).toLocaleString(
                                                    "en-BD",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
                                                    <span className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
                                                    {invoice.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap text-slate-300">
                                                {new Date(
                                                    invoice.issuedAt,
                                                ).toLocaleDateString(
                                                    "en-BD",
                                                )}
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap text-slate-300">
                                                {invoice.dueAt
                                                    ? new Date(
                                                          invoice.dueAt,
                                                      ).toLocaleDateString(
                                                          "en-BD",
                                                      )
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 shadow-xl backdrop-blur-xl">
                        <p className="text-xs sm:text-sm text-slate-400">
                            Page {meta.page} of {meta.totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                            {meta.page > 1 ? (
                                <a
                                    href={`/dashboard/admin/invoices?page=${meta.page - 1}`}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                                >
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </a>
                            ) : (
                                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950/40 px-4 text-xs font-semibold text-slate-600 cursor-not-allowed">
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </span>
                            )}

                            {meta.page < meta.totalPages ? (
                                <a
                                    href={`/dashboard/admin/invoices?page=${meta.page + 1}`}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </a>
                            ) : (
                                <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950/40 px-4 text-xs font-semibold text-slate-600 cursor-not-allowed">
                                    Next
                                    <ChevronRight className="size-4" />
                                </span>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}