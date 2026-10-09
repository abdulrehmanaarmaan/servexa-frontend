"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Eye } from "lucide-react";

import { workOrderService } from "@/services/work-order.service";

const WorkOrdersClient = () => {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["customer-work-orders"],
        queryFn: () =>
            workOrderService.getMyCustomerWorkOrders({
                page: 1,
                limit: 10,
                sortBy: "createdAt",
                sortOrder: "desc",
            }),
    });

    if (isLoading) {
        return (
            <section className="space-y-6 text-slate-100">
                <div>
                    <div className="flex items-center gap-2 text-teal-400">
                        <ClipboardList className="size-4 sm:size-5" />

                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            Service Tracking
                        </span>
                    </div>

                    <div className="mt-2 h-8 w-48 animate-pulse rounded-xl bg-white/10" />

                    <div className="mt-2 h-4 w-72 animate-pulse rounded-xl bg-white/10" />
                </div>

                <div className="grid gap-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-36 w-full animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="space-y-6 text-slate-100">
                <div>
                    <div className="flex items-center gap-2 text-teal-400">
                        <ClipboardList className="size-4 sm:size-5" />

                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            Service Tracking
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        My Work Orders
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Track the progress of your service work orders.
                    </p>
                </div>

                <div
                    role="alert"
                    className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-red-200 shadow-2xl backdrop-blur-xl sm:p-8"
                >
                    <h2 className="text-sm font-bold text-white sm:text-base">
                        Failed to load work orders
                    </h2>

                    <p className="mt-1 text-xs text-red-300 sm:text-sm">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again."}
                    </p>
                </div>
            </section>
        );
    }

    const workOrders = data?.data ?? [];

    return (
        <section className="space-y-6 text-slate-100">
            <div>
                <div className="flex items-center gap-2 text-teal-400">
                    <ClipboardList className="size-4 sm:size-5" />

                    <span className="text-xs font-semibold tracking-wide sm:text-sm">
                        Service Tracking
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    My Work Orders
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Track the progress of your service work orders.
                </p>
            </div>

            {workOrders.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 shadow-inner ring-1 ring-white/10">
                        <ClipboardList className="size-6 text-teal-400" />
                    </div>

                    <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                        No work orders yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                        Your work orders will appear here once a service
                        request is processed.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {workOrders.map((workOrder) => (
                        <article
                            key={workOrder.id}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-colors hover:bg-slate-900"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                                        Work Order
                                    </p>

                                    <h2 className="mt-1 truncate font-mono text-base font-bold text-white sm:text-lg">
                                        #{workOrder.id}
                                    </h2>

                                    {workOrder.service?.name && (
                                        <p className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">
                                            {workOrder.service.name}
                                        </p>
                                    )}
                                </div>

                                <span className="inline-flex h-fit w-fit items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
                                    <span className="size-1.5 animate-pulse rounded-full bg-teal-400" />

                                    {workOrder.status}
                                </span>
                            </div>

                            {workOrder.description && (
                                <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                                    {workOrder.description}
                                </p>
                            )}

                            <div className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-xs sm:grid-cols-3">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Service
                                    </p>

                                    <p className="mt-0.5 font-bold text-white">
                                        {workOrder.service?.name ??
                                            "Not available"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Created
                                    </p>

                                    <p className="mt-0.5 font-bold text-white">
                                        {new Date(
                                            workOrder.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Scheduled
                                    </p>

                                    <p className="mt-0.5 font-bold text-white">
                                        {workOrder.scheduledStart
                                            ? new Date(
                                                  workOrder.scheduledStart,
                                              ).toLocaleDateString()
                                            : "Not scheduled"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                                <Link
                                    href={`/dashboard/customer/work-orders/${workOrder.id}`}
                                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <Eye className="size-4" />
                                    View details
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {data?.meta && data.meta.total > 0 && (
                <div className="text-xs font-medium text-slate-400 sm:text-sm">
                    Showing {workOrders.length} of {data.meta.total} work
                    orders
                </div>
            )}
        </section>
    );
};

export default WorkOrdersClient;