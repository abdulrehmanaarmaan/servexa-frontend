import { getAdminAuditLogs } from "@/services/admin-audit.service";
import { AuditLog } from "@/types/dashboard";
import { ChevronLeft, ChevronRight, FileText, ShieldCheck } from "lucide-react";

interface AdminAuditLogsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        entity?: string;
        entityId?: string;
        actorId?: string;
    }>;
}

export default async function AdminAuditLogsPage({
    searchParams,
}: AdminAuditLogsPageProps) {
    const params = await searchParams;

    const page = Math.max(
        Number(params.page) || 1,
        1,
    );

    const limit = Math.min(
        Math.max(
            Number(params.limit) || 20,
            1,
        ),
        100,
    );

    const result = await getAdminAuditLogs({
        page,
        limit,
        entity: params.entity,
        entityId: params.entityId,
        actorId: params.actorId,
    });

    const logs = result.data;
    const meta = result.meta;
    console.log(result, logs, meta)

    return (
        <section className="space-y-6 text-slate-100">
            <div>
                <div className="flex items-center gap-2 text-teal-400">
                    <ShieldCheck className="size-4 sm:size-5" />
                    <span className="text-xs font-semibold tracking-wide sm:text-sm">
                        Security & Compliance
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Audit Logs
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Review important platform activity.
                </p>
            </div>

            {logs.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                        <FileText className="size-6 text-teal-400" />
                    </div>

                    <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                        No audit logs found
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
                        No audit logs found.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] sm:text-xs">
                                <tr>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Action
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Entity
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Entity ID
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Actor ID
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {logs.map((log: AuditLog) => (
                                    <tr
                                        key={log.id}
                                        className="transition-colors hover:bg-white/5"
                                    >
                                        <td className="px-5 py-4 font-bold text-white">
                                            {log.action}
                                        </td>

                                        <td className="px-5 py-4 text-slate-300">
                                            {log.entity}
                                        </td>

                                        <td className="px-5 py-4 font-mono text-xs text-slate-300">
                                            {log.entityId}
                                        </td>

                                        <td className="px-5 py-4 font-mono text-xs text-slate-300">
                                            {log.actorId ?? "System"}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap text-slate-300">
                                            {new Date(
                                                log.createdAt,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 shadow-xl backdrop-blur-xl">
                <p className="text-xs sm:text-sm text-slate-400">
                    Page {meta.page} of{" "}
                    {meta.totalPages}
                    {" · "}
                    {meta.total} total logs
                </p>

                <div className="flex items-center gap-2">
                    {meta.page > 1 && (
                        <a
                            href={`?page=${meta.page - 1}&limit=${meta.limit}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </a>
                    )}

                    {meta.page < meta.totalPages && (
                        <a
                            href={`?page=${meta.page + 1}&limit=${meta.limit}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}