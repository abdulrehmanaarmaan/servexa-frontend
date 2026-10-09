"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { WorkOrder } from "@/types/work-order";

// bKash rejects payments below this amount
const MIN_PAYABLE_TOTAL = 1;

interface CreateInvoiceDialogProps {
    open: boolean;
    workOrder: WorkOrder | null;
    isPending: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: {
        subtotal: number;
        tax: number;
        dueAt?: string;
    }) => void;
}

const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10);
};

export default function CreateInvoiceDialog({
    open,
    workOrder,
    isPending,
    onOpenChange,
    onSubmit,
}: CreateInvoiceDialogProps) {
    const [subtotal, setSubtotal] = useState("");
    const [tax, setTax] = useState("0");
    const [dueAt, setDueAt] = useState("");

    useEffect(() => {
        if (!open || !workOrder) {
            return;
        }

        const workOrderPrice = workOrder.servicePrice ?? 0;

        setSubtotal(String(workOrderPrice));
        setTax("0");
        setDueAt(getDefaultDueDate());
    }, [open, workOrder]);

    const numericSubtotal = Number(subtotal) || 0;
    const numericTax = Number(tax) || 0;

    const total = useMemo(
        () => numericSubtotal + numericTax,
        [numericSubtotal, numericTax],
    );

    const handleSubmit = () => {
        if (!workOrder) {
            return;
        }

        if (!Number.isFinite(numericSubtotal) || numericSubtotal <= 0) {
            toast.error("Subtotal must be greater than 0.");
            return;
        }

        if (!Number.isFinite(numericTax) || numericTax < 0) {
            toast.error("Tax cannot be negative.");
            return;
        }

        if (
            !Number.isInteger(Math.round(numericSubtotal * 100 * 1000) / 1000) ||
            !Number.isInteger(Math.round(numericTax * 100 * 1000) / 1000)
        ) {
            toast.error("Amounts can have at most 2 decimal places.");
            return;
        }

        if (total < MIN_PAYABLE_TOTAL) {
            toast.error(
                `The invoice total must be at least ৳${MIN_PAYABLE_TOTAL} to be payable online.`,
            );
            return;
        }

        onSubmit({
            subtotal: numericSubtotal,
            tax: numericTax,
            ...(dueAt
                ? {
                    dueAt: new Date(`${dueAt}T23:59:59`).toISOString(),
                }
                : {}),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden border border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-2xl sm:max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-teal-400 to-emerald-400" />

                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3.5">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                            <ReceiptText className="size-6" />
                        </div>

                        <div>
                            <DialogTitle className="text-lg font-bold text-white sm:text-xl">
                                Create invoice
                            </DialogTitle>

                            <DialogDescription className="text-xs text-slate-400 sm:text-sm">
                                Create an invoice for this completed work order.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!workOrder ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
                        <p className="text-sm text-slate-400">No work order selected.</p>
                    </div>
                ) : (
                    <div className="space-y-5 py-2">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4.5 shadow-inner">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                Work order
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                                {workOrder.service?.name ?? "Service work order"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                ID: {workOrder.id}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="invoice-subtotal"
                                className="text-xs font-medium text-slate-200 sm:text-sm"
                            >
                                Subtotal
                            </Label>

                            <Input
                                id="invoice-subtotal"
                                type="number"
                                min="0"
                                step="0.01"
                                value={subtotal}
                                onChange={(event) => setSubtotal(event.target.value)}
                                className="h-11 border-white/10 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 scheme-dark rounded-2xl px-4"
                            />

                            <p className="text-xs text-slate-500">
                                Defaulted from the work order service price.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="invoice-tax"
                                className="text-xs font-medium text-slate-200 sm:text-sm"
                            >
                                Tax
                            </Label>

                            <Input
                                id="invoice-tax"
                                type="number"
                                min="0"
                                step="0.01"
                                value={tax}
                                onChange={(event) => setTax(event.target.value)}
                                className="h-11 border-white/10 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 scheme-dark rounded-2xl px-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="invoice-due-date"
                                className="text-xs font-medium text-slate-200 sm:text-sm"
                            >
                                Due date
                            </Label>

                            <Input
                                id="invoice-due-date"
                                type="date"
                                value={dueAt}
                                onChange={(event) => setDueAt(event.target.value)}
                                className="h-11 border-white/10 bg-slate-950/80 text-sm text-slate-100 scheme-dark rounded-2xl px-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-2xl border border-teal-400/20 bg-teal-400/5 px-4.5 py-3.5 shadow-inner">
                                <span className="text-sm font-medium text-slate-300">
                                    Total
                                </span>

                                <span className="text-lg font-bold text-teal-400">
                                    ৳{total.toFixed(2)}
                                </span>
                            </div>

                            {total > 0 && total < MIN_PAYABLE_TOTAL && (
                                <p className="text-xs text-amber-300 px-1">
                                    Totals below ৳{MIN_PAYABLE_TOTAL} cannot be paid with bKash.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-3 sm:gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                        className="h-11 flex-1 border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white rounded-2xl"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={
                            isPending || !workOrder || workOrder.status !== "COMPLETED"
                        }
                        onClick={handleSubmit}
                        className="h-11 flex-1 bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20 rounded-2xl"
                    >
                        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Create invoice
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}