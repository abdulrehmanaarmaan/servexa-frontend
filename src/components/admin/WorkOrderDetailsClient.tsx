"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Loader2,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { workOrderService } from "@/services/work-order.service";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order";

interface WorkOrderDetailsClientProps {
    initialWorkOrder: WorkOrder;
}

const statusLabels: Record<WorkOrderStatus, string> = {
    OPEN: "Open",
    SCHEDULED: "Scheduled",
    ASSIGNED: "Assigned",
    EN_ROUTE: "En Route",
    IN_PROGRESS: "In Progress",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const statusOptions: WorkOrderStatus[] = [
    "OPEN",
    "SCHEDULED",
    "ASSIGNED",
    "EN_ROUTE",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED",
];

export default function WorkOrderDetailsClient({
    initialWorkOrder,
}: WorkOrderDetailsClientProps) {
    const queryClient = useQueryClient();

    const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus>(
        initialWorkOrder.status,
    );

    const [scheduledStart, setScheduledStart] = useState(
        initialWorkOrder.scheduledStart
            ? new Date(initialWorkOrder.scheduledStart).toISOString().slice(0, 16)
            : "",
    );

    const {
        data: workOrder,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["admin-work-order", initialWorkOrder.id],
        queryFn: () => workOrderService.getById(initialWorkOrder.id),
        initialData: initialWorkOrder,
    });

    const statusMutation = useMutation({
        mutationFn: (status: WorkOrderStatus) =>
            workOrderService.updateWorkOrderStatus(workOrder.id, {
                status,
            }),

        onSuccess: async (updatedWorkOrder) => {
            setSelectedStatus(updatedWorkOrder.status);

            await queryClient.invalidateQueries({
                queryKey: ["admin-work-order", workOrder.id],
            });

            await queryClient.invalidateQueries({
                queryKey: ["admin-work-orders"],
            });

            toast.success("Work order status updated successfully.");
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update work order status.",
            );
        },
    });

    const scheduleMutation = useMutation({
        mutationFn: (scheduledStart: string) => {
            const start = new Date(scheduledStart);
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            return workOrderService.scheduleWorkOrder(workOrder.id, {
                scheduledStart: start.toISOString(),
                scheduledEnd: end.toISOString(),
            });
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["admin-work-order", workOrder.id],
            });

            await queryClient.invalidateQueries({
                queryKey: ["admin-work-orders"],
            });

            toast.success("Work order schedule updated successfully.");
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to schedule work order.",
            );
        },
    });

    const statusChanged = selectedStatus !== workOrder.status;

    const scheduleChanged = useMemo(() => {
        if (!scheduledStart) {
            return false;
        }

        if (!workOrder.scheduledStart) {
            return true;
        }

        const current = new Date(workOrder.scheduledStart).toISOString();
        const next = new Date(scheduledStart).toISOString();

        return current !== next;
    }, [scheduledStart, workOrder.scheduledStart]);

    const handleStatusUpdate = () => {
        if (!statusChanged) {
            return;
        }

        statusMutation.mutate(selectedStatus);
    };

    const handleScheduleUpdate = () => {
        if (!scheduledStart) {
            toast.error("Please select a scheduled start time.");
            return;
        }

        scheduleMutation.mutate(scheduledStart);
    };

    if (isLoading) {
        return (
            <section className="space-y-8 text-slate-100">
                <div className="h-8 w-72 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl" />
                <div className="h-52 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl" />
            </section>
        );
    }

    if (isError) {
        return (
            <section className="space-y-8 text-slate-100">
                <div>
                    <Link
                        href="/dashboard/admin/work-orders"
                        className={buttonVariants({
                            variant: "ghost",
                            className: "px-0 text-slate-400 hover:bg-transparent hover:text-white",
                        })}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to work orders
                    </Link>
                </div>

                <div
                    role="alert"
                    className="rounded-3xl border border-red-500/30 bg-red-950/40 p-8 shadow-2xl backdrop-blur-xl"
                >
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 shadow-inner">
                        <ArrowLeft className="size-6" />
                    </div>

                    <h1 className="mt-5 text-lg font-bold text-white sm:text-xl">
                        Failed to load work order
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-red-300">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again."}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-8 text-slate-100">
            {/* Header & Back Button */}
            <div className="space-y-4">
                <Link
                    href="/dashboard/admin/work-orders"
                    className={buttonVariants({
                        variant: "ghost",
                        className: "px-0 text-slate-400 hover:bg-transparent hover:text-white",
                    })}
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Back to work orders
                </Link>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(45,212,191,0.08),transparent_50%)]" />
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                            <ClipboardList className="size-6" />
                        </div>

                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                                Work Order Details
                            </div>

                            <h1 className="mt-3 break-all text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                                #{workOrder.id}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    {/* Work Order Overview Card */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />
                        
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Service
                                </p>

                                <h2 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
                                    {workOrder.service?.name ?? "Service work order"}
                                </h2>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300 shadow-sm">
                                <span className="size-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                                {statusLabels[workOrder.status]}
                            </span>
                        </div>

                        {workOrder.description && (
                            <div className="mt-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                    {workOrder.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4.5 shadow-inner">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    Created
                                </p>

                                <p className="mt-1.5 text-sm font-semibold text-white">
                                    {new Date(workOrder.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4.5 shadow-inner">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    Service price
                                </p>

                                <p className="mt-1.5 text-sm font-semibold text-teal-400">
                                    {workOrder.servicePrice != null
                                        ? `৳${Number(workOrder.servicePrice).toFixed(2)}`
                                        : "Not available"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4.5 shadow-inner">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    Scheduled start
                                </p>

                                <p className="mt-1.5 text-sm font-semibold text-white">
                                    {workOrder.scheduledStart
                                        ? new Date(workOrder.scheduledStart).toLocaleString()
                                        : "Not scheduled"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4.5 shadow-inner">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    Updated
                                </p>

                                <p className="mt-1.5 text-sm font-semibold text-white">
                                    {workOrder.updatedAt
                                        ? new Date(workOrder.updatedAt).toLocaleString()
                                        : "Not available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STATUS UPDATE CARD */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />

                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                                <CheckCircle2 className="size-6" />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-white sm:text-lg">
                                    Update status
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Change the current work-order lifecycle status.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="work-order-status"
                                    className="text-xs font-medium text-slate-300"
                                >
                                    Status
                                </Label>

                                <select
                                    id="work-order-status"
                                    value={selectedStatus}
                                    onChange={(event) =>
                                        setSelectedStatus(event.target.value as WorkOrderStatus)
                                    }
                                    disabled={statusMutation.isPending}
                                    className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-slate-100 outline-none transition-colors focus:border-teal-400"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {statusLabels[status]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                type="button"
                                onClick={handleStatusUpdate}
                                disabled={!statusChanged || statusMutation.isPending}
                                className="w-full bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20 h-11 rounded-2xl"
                            >
                                {statusMutation.isPending && (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                )}
                                Update status
                            </Button>
                        </div>
                    </div>
                </div>

                {/* SCHEDULE SIDEBAR */}
                <aside className="space-y-6">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />

                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                                <CalendarClock className="size-6" />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-white sm:text-lg">
                                    Schedule work order
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Set when the work should begin.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="scheduled-start"
                                    className="text-xs font-medium text-slate-300"
                                >
                                    Scheduled start
                                </Label>

                                <Input
                                    id="scheduled-start"
                                    type="datetime-local"
                                    value={scheduledStart}
                                    onChange={(event) => setScheduledStart(event.target.value)}
                                    disabled={scheduleMutation.isPending}
                                    className="h-11 border-white/10 bg-slate-950 text-slate-100 scheme-dark rounded-2xl px-4"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={handleScheduleUpdate}
                                disabled={!scheduleChanged || scheduleMutation.isPending}
                                className="w-full bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20 h-11 rounded-2xl"
                            >
                                {scheduleMutation.isPending && (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                )}
                                Update schedule
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}