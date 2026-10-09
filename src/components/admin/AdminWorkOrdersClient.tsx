"use client";

import { useState } from "react";

import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowRight,
    ClipboardList,
    FilePlus2,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import CreateInvoiceDialog from "@/components/admin/CreateInvoiceDialog";

import { workOrderService } from "@/services/work-order.service";
import { createInvoice } from "@/services/invoice.service";

import type { WorkOrder } from "@/types/work-order";
import type { WorkOrderStatus } from "@/types/work-order";

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

const WorkOrdersClient = () => {
    const queryClient = useQueryClient();

    const [selectedWorkOrder, setSelectedWorkOrder] =
        useState<WorkOrder | null>(null);

    const [invoiceDialogOpen, setInvoiceDialogOpen] =
        useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["admin-work-orders"],
        queryFn: () =>
            workOrderService.getAllWorkOrders({
                page: 1,
                limit: 10,
                sortBy: "createdAt",
                sortOrder: "desc",
            }),
    });

    const createInvoiceMutation = useMutation({
        mutationFn: ({
            workOrderId,
            payload,
        }: {
            workOrderId: string;
            payload: {
                subtotal: number;
                tax: number;
                dueAt?: string;
            };
        }) => createInvoice(workOrderId, payload),

        onSuccess: () => {
            toast.success("Invoice created successfully.");

            setInvoiceDialogOpen(false);
            setSelectedWorkOrder(null);

            void queryClient.invalidateQueries({
                queryKey: ["admin-work-orders"],
            });

            void queryClient.invalidateQueries({
                queryKey: ["admin-invoices"],
            });
        },

        onError: (error) => {
            console.log(error.message)
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create invoice.",
            );
        },
    });

    const handleOpenInvoiceDialog = (
        workOrder: WorkOrder,
    ) => {
        if (workOrder.status !== "COMPLETED") {
            toast.error(
                "An invoice can only be created for a completed work order.",
            );

            return;
        }

        setSelectedWorkOrder(workOrder);
        setInvoiceDialogOpen(true);
    };

    const handleCreateInvoice = (payload: {
        subtotal: number;
        tax: number;
        dueAt?: string;
    }) => {
        if (!selectedWorkOrder) {
            return;
        }

        createInvoiceMutation.mutate({
            workOrderId: selectedWorkOrder.id,
            payload,
        });
    };

    if (isLoading) {
        return (
            <section className="space-y-6 text-slate-100">
                <div>
                    <div className="flex items-center gap-2 text-teal-400">
                        <ClipboardList className="size-4 sm:size-5" />

                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            Operations
                        </span>
                    </div>

                    <div className="mt-2 h-8 w-56 animate-pulse rounded-xl bg-white/10" />

                    <div className="mt-2 h-4 w-80 animate-pulse rounded-xl bg-white/10" />
                </div>

                <div className="grid gap-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-40 w-full animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
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
                            Operations
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Work Orders
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Manage service work orders and create invoices for
                        completed jobs.
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
        <>
            <section className="space-y-6 text-slate-100">
                <div>
                    <div className="flex items-center gap-2 text-teal-400">
                        <ClipboardList className="size-4 sm:size-5" />

                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            Operations
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Work Orders
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Manage service work orders and create invoices for
                        completed jobs.
                    </p>
                </div>

                {workOrders.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 shadow-inner ring-1 ring-white/10">
                            <ClipboardList className="size-6 text-teal-400" />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                            No work orders found
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                            Work orders created from service requests will
                            appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {workOrders.map((workOrder) => (
                            <article
                                key={workOrder.id}
                                className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl transition-colors hover:bg-slate-900 sm:p-6"
                            >
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
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
                                            <span className="size-1.5 rounded-full bg-teal-400" />

                                            {statusLabels[
                                                workOrder.status
                                            ] ?? workOrder.status}
                                        </span>
                                    </div>

                                    {workOrder.description && (
                                        <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                                            {workOrder.description}
                                        </p>
                                    )}

                                    <div className="grid gap-4 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-xs sm:grid-cols-3">
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

                                    <div className="flex flex-col gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
                                        <Link
                                            href={`/dashboard/admin/work-orders/${workOrder.id}`}
                                            className={buttonVariants({
                                                variant: "outline",
                                                size: "lg",
                                                className:
                                                    "h-9 border-white/10 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white",
                                            })}
                                        >
                                            <span>View details</span>
                                            <ArrowRight className="size-4" />
                                        </Link>

                                        {workOrder.status ===
                                            "COMPLETED" && (
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenInvoiceDialog(
                                                        workOrder,
                                                    )
                                                }
                                                disabled={
                                                    createInvoiceMutation.isPending
                                                }
                                                className="h-9 bg-teal-400 text-xs font-semibold text-slate-950 hover:bg-teal-300"
                                            >
                                                {createInvoiceMutation.isPending &&
                                                selectedWorkOrder?.id ===
                                                    workOrder.id ? (
                                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                                ) : (
                                                    <FilePlus2 className="mr-2 size-4" />
                                                )}

                                                Create invoice
                                            </Button>
                                        )}
                                    </div>
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

            <CreateInvoiceDialog
                open={invoiceDialogOpen}
                workOrder={selectedWorkOrder}
                isPending={createInvoiceMutation.isPending}
                onOpenChange={(open) => {
                    setInvoiceDialogOpen(open);

                    if (!open) {
                        setSelectedWorkOrder(null);
                    }
                }}
                onSubmit={handleCreateInvoice}
            />
        </>
    );
};

export default WorkOrdersClient;