"use client";

import Link from "next/link";

import {
    ArrowLeft,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    Clock3,
    FileText,
    MapPin,
    PackageCheck,
    UserRound,
    Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import type {
    WorkOrder,
    WorkOrderStatus,
} from "@/types/work-order";

interface CustomerWorkOrderDetailsClientProps {
    initialWorkOrder: WorkOrder;
}

const statusLabels: Record<
    WorkOrderStatus,
    string
> = {
    OPEN: "Open",
    SCHEDULED: "Scheduled",
    ASSIGNED: "Assigned",
    EN_ROUTE: "En Route",
    IN_PROGRESS: "In Progress",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const statusStyles: Record<
    WorkOrderStatus,
    string
> = {
    OPEN:
        "border-blue-400/30 bg-blue-400/10 text-blue-300",
    SCHEDULED:
        "border-violet-400/30 bg-violet-400/10 text-violet-300",
    ASSIGNED:
        "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    EN_ROUTE:
        "border-amber-400/30 bg-amber-400/10 text-amber-300",
    IN_PROGRESS:
        "border-teal-400/30 bg-teal-400/10 text-teal-300",
    ON_HOLD:
        "border-orange-400/30 bg-orange-400/10 text-orange-300",
    COMPLETED:
        "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    CANCELLED:
        "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

const formatDate = (
    value?: string | Date | null,
) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const formatAmount = (
    value?: number | string | null,
) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "—";
    }

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return String(value);
    }

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(amount);
};

export default function CustomerWorkOrderDetailsClient({
    initialWorkOrder,
}: CustomerWorkOrderDetailsClientProps) {
    const workOrder = initialWorkOrder;

    const activeAssignments =
        workOrder.assignments ?? [];

    const statusHistory =
        workOrder.statusHistory ?? [];

    const notes = workOrder.notes ?? [];

    const invoice = workOrder.invoice;

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-12 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <Link
                        href="/dashboard/customer/work-orders"
                        className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-teal-400 outline-none"
                    >
                        <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back to work orders
                    </Link>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 shadow-inner">
                            <Wrench className="size-5 text-teal-400" />
                        </div>

                        <Badge
                            variant="outline"
                            className={`px-3 py-1 font-semibold ${
                                statusStyles[
                                    workOrder.status
                                ]
                            }`}
                        >
                            {
                                statusLabels[
                                    workOrder.status
                                ]
                            }
                        </Badge>
                    </div>

                    <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Work Order
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-400">
                        Work order ID:{" "}
                        <span className="font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                            {workOrder.id}
                        </span>
                    </p>
                </div>

                {invoice && (
                    <Link
                        href="/dashboard/customer/invoices"
                        className="shrink-0"
                    >
                        <Button
                            variant="outline"
                            className="border-white/10 bg-slate-900/80 backdrop-blur-xl text-slate-200 shadow-sm hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
                        >
                            <FileText className="mr-2 size-4 text-teal-400" />
                            View Invoices
                        </Button>
                    </Link>
                )}
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    icon={PackageCheck}
                    label="Service"
                    value={
                        workOrder.service?.name ??
                        "—"
                    }
                />

                <SummaryCard
                    icon={Clock3}
                    label="Status"
                    value={
                        statusLabels[
                            workOrder.status
                        ]
                    }
                />

                <SummaryCard
                    icon={CalendarClock}
                    label="Created"
                    value={formatDate(
                        workOrder.createdAt,
                    )}
                />

                <SummaryCard
                    icon={FileText}
                    label="Service Price"
                    value={formatAmount(
                        workOrder.servicePrice,
                    )}
                />
            </div>

            {/* Main details */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl lg:col-span-2">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <ClipboardList className="size-5 text-teal-400" />
                            Work Order Details
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                label="Service"
                                value={
                                    workOrder.service
                                        ?.name ?? "—"
                                }
                            />

                            <InfoItem
                                label="Status"
                                value={
                                    statusLabels[
                                        workOrder.status
                                    ]
                                }
                            />

                            <InfoItem
                                label="Created"
                                value={formatDate(
                                    workOrder.createdAt,
                                )}
                            />

                            <InfoItem
                                label="Last updated"
                                value={formatDate(
                                    workOrder.updatedAt,
                                )}
                            />

                            <InfoItem
                                label="Scheduled start"
                                value={formatDate(
                                    workOrder.scheduledStart,
                                )}
                            />

                            <InfoItem
                                label="Scheduled end"
                                value={formatDate(
                                    workOrder.scheduledEnd,
                                )}
                            />
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Description
                            </p>

                            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300 shadow-inner">
                                {workOrder.description ||
                                    "No description was provided."}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assignment */}
                <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl flex flex-col">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <UserRound className="size-5 text-teal-400" />
                            Technician
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6 flex-1 flex flex-col justify-center">
                        {activeAssignments.length >
                        0 ? (
                            <div className="space-y-4 w-full">
                                {activeAssignments.map(
                                    (assignment) => (
                                        <div
                                            key={
                                                assignment.id
                                            }
                                            className="rounded-xl border border-white/10 bg-slate-950/60 p-4 shadow-sm"
                                        >
                                            <p className="font-semibold text-white">
                                                {assignment
                                                    .technician
                                                    ?.name ??
                                                    "Assigned technician"}
                                            </p>

                                            {assignment
                                                .technician
                                                ?.employeeCode && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Employee code:{" "}
                                                    <span className="font-mono text-slate-400">
                                                        {
                                                            assignment
                                                                .technician
                                                                .employeeCode
                                                        }
                                                    </span>
                                                </p>
                                            )}

                                            {assignment
                                                .technician
                                                ?.phone && (
                                                <p className="mt-2 text-sm text-slate-400 flex items-center gap-1.5 font-mono">
                                                    {
                                                        assignment
                                                            .technician
                                                            .phone
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center w-full">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 mb-3 shadow-inner">
                                    <UserRound className="size-6" />
                                </div>

                                <p className="text-sm font-semibold text-white">
                                    No technician assigned
                                </p>

                                <p className="mt-1.5 text-xs leading-relaxed text-slate-400 max-w-xs mx-auto">
                                    A technician will appear here
                                    once the work order is assigned.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Address + invoice */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <MapPin className="size-5 text-teal-400" />
                            Service Address
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {workOrder.address ? (
                            <div className="space-y-2.5 text-sm text-slate-300 rounded-xl border border-white/10 bg-slate-950/60 p-4">
                                <p className="font-semibold text-white">
                                    {workOrder.address.label ??
                                        "Service Address"}
                                </p>

                                <p className="text-slate-300">
                                    {
                                        workOrder.address
                                            .addressLine
                                    }
                                </p>

                                {workOrder.address.city && (
                                    <p className="text-slate-400">
                                        {
                                            workOrder
                                                .address
                                                .city
                                        }
                                        {workOrder.address
                                            .area
                                            ? `, ${workOrder.address.area}`
                                            : ""}
                                    </p>
                                )}

                                {workOrder.address.phone && (
                                    <p className="pt-2 text-xs font-mono text-slate-400 border-t border-white/5">
                                        Phone:{" "}
                                        {
                                            workOrder
                                                .address
                                                .phone
                                        }
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 mb-3 shadow-inner">
                                    <MapPin className="size-6" />
                                </div>
                                <p className="text-sm font-semibold text-white">
                                    No address specified
                                </p>
                                <p className="mt-1.5 text-xs text-slate-400">
                                    No address information is
                                    available.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <FileText className="size-5 text-teal-400" />
                            Invoice
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {invoice ? (
                            <div className="space-y-4 rounded-xl border border-white/10 bg-slate-950/60 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">
                                        Total Amount
                                    </span>

                                    <span className="font-bold text-white text-base">
                                        {formatAmount(
                                            invoice.total,
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-sm text-slate-400">
                                        Status
                                    </span>

                                    <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-200">
                                        {invoice.status}
                                    </Badge>
                                </div>

                                <Link href="/dashboard/customer/invoices" className="block pt-2">
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
                                    >
                                        Open Invoice Center
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 mb-3 shadow-inner">
                                    <FileText className="size-6" />
                                </div>

                                <p className="text-sm font-semibold text-white">
                                    No invoice yet
                                </p>

                                <p className="mt-1.5 text-xs leading-relaxed text-slate-400 max-w-xs mx-auto">
                                    An invoice will appear here
                                    once one is generated.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Status history */}
            <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                        <Clock3 className="size-5 text-teal-400" />
                        Status History
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    {statusHistory.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 mb-3 shadow-inner">
                                <Clock3 className="size-6" />
                            </div>
                            <p className="text-sm font-semibold text-white">
                                No history available
                            </p>
                            <p className="mt-1.5 text-xs text-slate-400">
                                No status history is available.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {statusHistory.map(
                                (history) => (
                                    <div
                                        key={history.id}
                                        className="flex gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4 shadow-sm"
                                    >
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 shadow-inner">
                                            <CheckCircle2 className="size-4 text-teal-400" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {history.fromStatus && (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-white/10 bg-white/5 text-slate-400"
                                                    >
                                                        {
                                                            statusLabels[
                                                                history
                                                                    .fromStatus
                                                            ]
                                                        }
                                                    </Badge>
                                                )}

                                                <span className="text-slate-600 font-bold">
                                                    →
                                                </span>

                                                <Badge
                                                    variant="outline"
                                                    className="border-teal-400/30 bg-teal-400/10 text-teal-300 font-semibold"
                                                >
                                                    {
                                                        statusLabels[
                                                            history
                                                                .toStatus
                                                        ]
                                                    }
                                                </Badge>
                                            </div>

                                            {history.reason && (
                                                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                                                    {
                                                        history.reason
                                                    }
                                                </p>
                                            )}

                                            <p className="mt-2 text-xs text-slate-500 font-mono">
                                                {formatDate(
                                                    history.changedAt,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                        <FileText className="size-5 text-teal-400" />
                        Work Order Notes
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    {notes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 mb-3 shadow-inner">
                                <FileText className="size-6" />
                            </div>
                            <p className="text-sm font-semibold text-white">
                                No notes recorded
                            </p>
                            <p className="mt-1.5 text-xs text-slate-400">
                                No notes are available for this work
                                order.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="rounded-xl border border-white/10 bg-slate-950/50 p-4 shadow-sm"
                                >
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                                        {note.content}
                                    </p>

                                    <p className="mt-3 text-xs text-slate-500 font-mono border-t border-white/5 pt-2">
                                        {formatDate(
                                            note.createdAt,
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Related request */}
            {workOrder.serviceRequest && (
                <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <ClipboardList className="size-5 text-teal-400" />
                            Related Service Request
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-sm text-slate-300">
                                This work order was created from
                                your service request.
                            </p>

                            <p className="mt-1 font-mono text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded border border-white/5 inline-block">
                                ID: {
                                    workOrder
                                        .serviceRequest
                                        .id
                                }
                            </p>
                        </div>

                        <Link
                            href={`/dashboard/customer/requests/${workOrder.serviceRequest.id}`}
                            className="shrink-0"
                        >
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto border-white/10 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
                            >
                                View Request
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof PackageCheck;
    label: string;
    value: string;
}) {
    return (
        <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl backdrop-blur-xl transition-all hover:border-teal-500/30">
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 shadow-inner">
                        <Icon className="size-5 text-teal-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {label}
                        </p>

                        <p className="mt-0.5 truncate text-sm font-black text-white sm:text-base">
                            {value}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="break-words text-sm font-semibold text-slate-100">
                {value}
            </p>
        </div>
    );
}