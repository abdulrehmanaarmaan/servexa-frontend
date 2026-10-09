import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { serverApiFetch } from "@/lib/api-server";
import { endpoints } from "@/lib/endpoints";

import type {
    WorkOrder,
} from "@/types/dashboard";

import AssignmentManager from "@/components/admin/AssignmentManager";

interface AdminAssignmentPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AdminAssignmentPage({
    params,
}: AdminAssignmentPageProps) {
    const { id } = await params;

    const [workOrder] = await Promise.all([
        serverApiFetch<WorkOrder>(
            endpoints.workOrders.detail(id),
        ),
    ]);

    return (
        <section className="space-y-6 text-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400 sm:text-sm">
                        <Link
                            href="/dashboard/admin/assignments"
                            className="transition-colors hover:text-teal-400"
                        >
                            Assignments
                        </Link>

                        <ChevronRight className="size-3.5 text-slate-600" />

                        <span className="text-slate-200">
                            Work Order
                        </span>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                        {workOrder.title ?? "Work Order"}
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Manage technician assignments for
                        this work order.
                    </p>
                </div>

                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
                    <span className="size-1.5 animate-pulse rounded-full bg-teal-400" />
                    {workOrder.status}
                </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                            Work Order ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs font-bold text-slate-200 sm:text-sm">
                            {workOrder.id}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                            Status
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-200 sm:text-sm">
                            {workOrder.status}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                            Assignment
                        </p>

                        <p className="mt-1 text-xs font-bold text-teal-400 sm:text-sm">
                            Technician management
                        </p>
                    </div>
                </div>
            </div>

            <AssignmentManager
                workOrderId={workOrder.id}
            />
        </section>
    );
}