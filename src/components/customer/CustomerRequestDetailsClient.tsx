"use client";

import Link from "next/link";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    MapPin,
    PackageCheck,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ServiceRequest } from "@/types/request";

interface CustomerRequestDetailsClientProps {
    initialRequest: ServiceRequest;
}

const statusLabels: Record<
    ServiceRequest["status"],
    string
> = {
    PENDING: "Pending",
    REVIEWED: "Reviewed",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CONVERTED: "Converted",
    CANCELLED: "Cancelled",
};

const priorityLabels: Record<
    ServiceRequest["priority"],
    string
> = {
    LOW: "Low",
    NORMAL: "Normal",
    HIGH: "High",
    URGENT: "Urgent",
};

const statusStyles: Record<
    ServiceRequest["status"],
    string
> = {
    PENDING:
        "border-amber-400/30 bg-amber-400/10 text-amber-300",
    REVIEWED:
        "border-blue-400/30 bg-blue-400/10 text-blue-300",
    APPROVED:
        "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    REJECTED:
        "border-rose-400/30 bg-rose-400/10 text-rose-300",
    CONVERTED:
        "border-teal-400/30 bg-teal-400/10 text-teal-300",
    CANCELLED:
        "border-slate-400/30 bg-slate-400/10 text-slate-300",
};

const priorityStyles: Record<
    ServiceRequest["priority"],
    string
> = {
    LOW:
        "border-slate-400/30 bg-slate-400/10 text-slate-300",
    NORMAL:
        "border-blue-400/30 bg-blue-400/10 text-blue-300",
    HIGH:
        "border-orange-400/30 bg-orange-400/10 text-orange-300",
    URGENT:
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

const getStatusIcon = (
    status: ServiceRequest["status"],
) => {
    switch (status) {
        case "APPROVED":
            return CheckCircle2;

        case "REJECTED":
        case "CANCELLED":
            return XCircle;

        case "CONVERTED":
            return PackageCheck;

        case "REVIEWED":
            return ClipboardList;

        default:
            return Clock3;
    }
};

export default function CustomerRequestDetailsClient({
    initialRequest,
}: CustomerRequestDetailsClientProps) {
    const request = initialRequest;

    const StatusIcon = getStatusIcon(
        request.status,
    );

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8 text-slate-100">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.06),transparent_60%)]" />

                <div className="relative z-10 flex flex-col gap-6">
                    <div>
                        <Link
                            href="/dashboard/customer/requests"
                            className="group mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-teal-400"
                        >
                            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                            Back to requests
                        </Link>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <div className="flex size-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 shadow-inner">
                                        <ClipboardList className="size-5 text-teal-400" />
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={`px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                                    >
                                        <StatusIcon className="mr-1.5 size-3.5" />
                                        {statusLabels[request.status]}
                                    </Badge>

                                    <Badge
                                        variant="outline"
                                        className={`px-3 py-1 text-xs font-semibold ${priorityStyles[request.priority]}`}
                                    >
                                        {priorityLabels[request.priority]} priority
                                    </Badge>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                        Service Request
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Request ID:{" "}
                                        <span className="font-mono font-medium text-slate-300">
                                            {request.id}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main information */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Request overview */}
                <Card className="border-white/10 bg-slate-900/85 text-slate-100 shadow-xl backdrop-blur-xl lg:col-span-2">
                    <CardHeader className="border-b border-white/10 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <div className="flex size-8 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                                <ClipboardList className="size-4 text-teal-400" />
                            </div>
                            Request Details
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                label="Service"
                                value={
                                    request.service?.name ??
                                    "Service unavailable"
                                }
                            />

                            <InfoItem
                                label="Priority"
                                value={
                                    priorityLabels[
                                        request.priority
                                    ]
                                }
                            />

                            <InfoItem
                                label="Created"
                                value={formatDate(
                                    request.createdAt,
                                )}
                            />

                            <InfoItem
                                label="Last updated"
                                value={formatDate(
                                    request.updatedAt,
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Description
                            </p>

                            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300 shadow-inner">
                                {request.description ? (
                                    <p className="whitespace-pre-wrap">{request.description}</p>
                                ) : (
                                    <div className="flex items-center gap-3 py-2 text-slate-500">
                                        <Clock3 className="size-4 shrink-0" />
                                        <p className="text-xs italic">
                                            No description was provided.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status card */}
                <Card className="border-white/10 bg-slate-900/85 text-slate-100 shadow-xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/10 pb-4">
                        <CardTitle className="text-base font-bold text-white">
                            Current Status
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner">
                            <div className="flex items-center gap-3.5">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 shadow-inner">
                                    <StatusIcon className="size-5 text-teal-400" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-bold text-white">
                                        {
                                            statusLabels[
                                                request.status
                                            ]
                                        }
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Request status
                                    </p>
                                </div>
                            </div>

                            {request.status ===
                                "APPROVED" && (
                                <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3.5 text-xs font-medium leading-relaxed text-emerald-200">
                                    Your request has been
                                    approved. Servexa can now
                                    process it into a work order.
                                </div>
                            )}

                            {request.status ===
                                "CONVERTED" &&
                                request.workOrder && (
                                    <div className="mt-5">
                                        <Link
                                            href={`/dashboard/customer/work-orders/${request.workOrder.id}`}
                                        >
                                            <Button className="w-full bg-teal-400 font-semibold text-slate-950 shadow-md shadow-teal-500/10 hover:bg-teal-300">
                                                View Work Order
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                            {request.status ===
                                "REJECTED" && (
                                <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3.5 text-xs font-medium leading-relaxed text-rose-200">
                                    This request was rejected by
                                    the service team.
                                </div>
                            )}

                            {request.status ===
                                "CANCELLED" && (
                                <div className="mt-5 rounded-xl border border-slate-400/20 bg-slate-400/5 p-3.5 text-xs font-medium leading-relaxed text-slate-300">
                                    This request has been
                                    cancelled.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service + address */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-slate-900/85 text-slate-100 shadow-xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/10 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <div className="flex size-8 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                                <PackageCheck className="size-4 text-teal-400" />
                            </div>
                            Service
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-6">
                        <InfoItem
                            label="Service name"
                            value={
                                request.service?.name ??
                                "—"
                            }
                        />

                        <InfoItem
                            label="Service ID"
                            value={
                                request.serviceId
                            }
                        />

                        {request.service?.description && (
                            <div className="space-y-1.5 pt-1">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Description
                                </p>

                                <p className="text-sm leading-relaxed text-slate-300">
                                    {
                                        request.service
                                            .description
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/85 text-slate-100 shadow-xl backdrop-blur-xl">
                    <CardHeader className="border-b border-white/10 pb-4">
                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                            <div className="flex size-8 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                                <MapPin className="size-4 text-teal-400" />
                            </div>
                            Service Address
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {request.address ? (
                            <div className="space-y-2 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300 shadow-inner">
                                <p className="font-semibold text-white">
                                    {request.address.label ??
                                        "Service Address"}
                                </p>

                                <p className="text-slate-300">
                                    {request.address.addressLine}
                                </p>

                                {request.address.city && (
                                    <p className="text-slate-400">
                                        {
                                            request.address.city
                                        }
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/30 p-8 text-center">
                                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                                    <MapPin className="size-4" />
                                </div>
                                <p className="text-xs font-semibold text-slate-300">
                                    No Address Assigned
                                </p>
                                <p className="mt-1 max-w-xs text-xs text-slate-500">
                                    No address information is available for this request.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card className="border-white/10 bg-slate-900/85 text-slate-100 shadow-xl backdrop-blur-xl">
                <CardHeader className="border-b border-white/10 pb-4">
                    <CardTitle className="flex items-center gap-2.5 text-base font-bold text-white">
                        <div className="flex size-8 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                            <CalendarDays className="size-4 text-teal-400" />
                        </div>
                        Request Timeline
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TimelineItem
                            label="Created"
                            value={formatDate(
                                request.createdAt,
                            )}
                        />

                        <TimelineItem
                            label="Last updated"
                            value={formatDate(
                                request.updatedAt,
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
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
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5 shadow-inner">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="break-words text-sm font-medium text-slate-200">
                {value}
            </p>
        </div>
    );
}

function TimelineItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-slate-950/50 p-4 shadow-inner">
            <div className="mt-1 size-2.5 shrink-0 rounded-full bg-teal-400 ring-4 ring-teal-400/10" />

            <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                    {label}
                </p>

                <p className="mt-0.5 text-xs font-mono text-slate-400">
                    {value}
                </p>
            </div>
        </div>
    );
}