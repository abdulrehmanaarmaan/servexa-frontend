"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    AlertCircle,
    ShieldCheck,
    Users,
} from "lucide-react";
import { toast } from "sonner";

import { useAdminTechnicians } from "@/hooks/useAdminTechnicians";
import type { AdminTechnician } from "@/types/dashboard";
import { updateAdminTechnicianStatus } from "@/services/admin.service";

interface AdminTechniciansClientProps {
    initialTechnicians: AdminTechnician[];
}

export default function AdminTechniciansClient({
    initialTechnicians,
}: AdminTechniciansClientProps) {
    const queryClient = useQueryClient();

    const {
        data: technicians = [],
        isLoading,
        isError,
    } = useAdminTechnicians(initialTechnicians);

    const statusMutation = useMutation({
        mutationFn: ({
            technicianId,
            isActive,
        }: {
            technicianId: string;
            isActive: boolean;
        }) =>
            updateAdminTechnicianStatus(
                technicianId,
                isActive,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-technicians"],
            });

            toast.success(
                "Technician status updated successfully.",
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    if (isLoading && technicians.length === 0) {
        return <TechniciansSkeleton />;
    }

    if (isError && technicians.length === 0) {
        return (
            <section className="space-y-6 text-slate-100">
                <PageHeader />

                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200 shadow-xl backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-400" />

                        <div>
                            <h2 className="font-bold text-white">
                                Error loading technicians
                            </h2>

                            <p className="mt-1">
                                Failed to load technicians.
                                Please try again.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6 text-slate-100">
            <PageHeader />

            {technicians.length === 0 ? (
                <Empty message="No technicians found." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="border-b border-white/10 bg-slate-950/60 text-[10px] tracking-wider text-slate-400 uppercase sm:text-xs">
                                <tr>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Name
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Email
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Phone
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Employee Code
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-5 py-3.5 font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {technicians.map(
                                    (technician) => (
                                        <tr
                                            key={
                                                technician.id
                                            }
                                            className="transition-colors hover:bg-white/5"
                                        >
                                            <td className="px-5 py-4 font-bold text-white">
                                                {technician.name ||
                                                    "—"}
                                            </td>

                                            <td className="px-5 py-4 text-slate-300">
                                                {technician.user
                                                    ?.email ||
                                                    "—"}
                                            </td>

                                            <td className="px-5 py-4 text-slate-300">
                                                {technician.phone ||
                                                    "—"}
                                            </td>

                                            <td className="px-5 py-4 font-mono text-slate-300">
                                                {technician.employeeCode ||
                                                    "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    isActive={
                                                        technician.isActive
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4">
                                                <select
                                                    value={
                                                        technician.isActive
                                                            ? "ACTIVE"
                                                            : "INACTIVE"
                                                    }
                                                    disabled={
                                                        statusMutation.isPending
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) => {
                                                        const isActive =
                                                            event
                                                                .target
                                                                .value ===
                                                            "ACTIVE";

                                                        statusMutation.mutate(
                                                            {
                                                                technicianId:
                                                                    technician.id,
                                                                isActive,
                                                            },
                                                        );
                                                    }}
                                                    className="h-9 rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                                                >
                                                    <option
                                                        value="ACTIVE"
                                                        className="bg-slate-950 text-white"
                                                    >
                                                        Active
                                                    </option>

                                                    <option
                                                        value="INACTIVE"
                                                        className="bg-slate-950 text-white"
                                                    >
                                                        Inactive
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}

function PageHeader() {
    return (
        <div>
            <div className="flex items-center gap-2 text-teal-400">
                <ShieldCheck className="size-4 sm:size-5" />

                <span className="text-xs font-semibold tracking-wide sm:text-sm">
                    Team Operations
                </span>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Technicians
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                Manage Servexa technicians and their
                account status.
            </p>
        </div>
    );
}

function StatusBadge({
    isActive,
}: {
    isActive: boolean;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                isActive
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-slate-500/30 bg-slate-500/10 text-slate-400"
            }`}
        >
            <span
                className={`size-1.5 rounded-full ${
                    isActive
                        ? "animate-pulse bg-emerald-400"
                        : "bg-slate-400"
                }`}
            />

            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

function Empty({
    message,
}: {
    message: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 shadow-inner ring-1 ring-white/10">
                <Users className="size-6 text-teal-400" />
            </div>

            <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                No technicians found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
                {message}
            </p>
        </div>
    );
}

function TechniciansSkeleton() {
    return (
        <section className="space-y-6 text-slate-100">
            <div>
                <div className="h-5 w-28 animate-pulse rounded-full bg-slate-800" />

                <div className="mt-3 h-8 w-44 animate-pulse rounded-lg bg-slate-800" />

                <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-slate-800/60" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <div className="h-12 animate-pulse border-b border-white/10 bg-slate-950/60" />

                {Array.from({ length: 5 }).map(
                    (_, index) => (
                        <div
                            key={`technician-skeleton-${index}`}
                            className="grid grid-cols-6 gap-4 border-b border-white/5 p-5 last:border-b-0"
                        >
                            {Array.from({
                                length: 6,
                            }).map(
                                (_, cellIndex) => (
                                    <div
                                        key={`cell-skeleton-${cellIndex}`}
                                        className="h-5 animate-pulse rounded-lg bg-slate-800/80"
                                    />
                                ),
                            )}
                        </div>
                    ),
                )}
            </div>
        </section>
    );
}