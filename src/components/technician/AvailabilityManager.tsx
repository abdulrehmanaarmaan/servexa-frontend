"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Calendar, Trash2, Edit3, X } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";

import type {
    Availability,
    AvailabilityStatus,
} from "@/types/availability";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AvailabilityManagerProps {
    initialAvailabilities: Availability[];
}

interface AvailabilityFormState {
    startAt: string;
    endAt: string;
    status: "AVAILABLE" | "UNAVAILABLE";
}

const initialForm: AvailabilityFormState = {
    startAt: "",
    endAt: "",
    status: "AVAILABLE",
};

function formatDateTime(value: string) {
    return new Date(value).toLocaleString();
}

function toInputDateTime(value: string) {
    const date = new Date(value);

    const offset = date.getTimezoneOffset();
    const localDate = new Date(
        date.getTime() - offset * 60 * 1000,
    );

    return localDate.toISOString().slice(0, 16);
}

export default function AvailabilityManager({
    initialAvailabilities,
}: AvailabilityManagerProps) {
    const [availabilities, setAvailabilities] = useState(
        initialAvailabilities,
    );

    const [form, setForm] =
        useState<AvailabilityFormState>(initialForm);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    // Track original form state when editing to detect unchanged submissions
    const [initialEditingForm, setInitialEditingForm] =
        useState<AvailabilityFormState>(initialForm);

    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const handleChange = (
        field: keyof AvailabilityFormState,
        value: string,
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setInitialEditingForm(initialForm);
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!form.startAt || !form.endAt) {
            toast.error(
                "Please provide both start and end time.",
            );
            return;
        }

        const startAt = new Date(form.startAt);
        const endAt = new Date(form.endAt);

        if (endAt <= startAt) {
            toast.error(
                "End time must be later than start time.",
            );
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                startAt: startAt.toISOString(),
                endAt: endAt.toISOString(),
                status: form.status,
            };

            if (editingId) {
                const updated =
                    await apiFetch<Availability>(
                        endpoints.availability.update(
                            editingId,
                        ),
                        {
                            method: "PATCH",
                            body: JSON.stringify(payload),
                        },
                    );

                setAvailabilities((previous) =>
                    previous.map((availability) =>
                        availability.id === editingId
                            ? updated
                            : availability,
                    ),
                );

                toast.success(
                    "Availability updated successfully.",
                );
            } else {
                const created =
                    await apiFetch<Availability>(
                        endpoints.availability.create,
                        {
                            method: "POST",
                            body: JSON.stringify(payload),
                        },
                    );

                setAvailabilities((previous) =>
                    [...previous, created].sort(
                        (a, b) =>
                            new Date(a.startAt).getTime() -
                            new Date(b.startAt).getTime(),
                    ),
                );

                toast.success(
                    "Availability created successfully.",
                );
            }

            resetForm();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (
        availability: Availability,
    ) => {
        setEditingId(availability.id);

        const formData: AvailabilityFormState = {
            startAt: toInputDateTime(
                availability.startAt,
            ),
            endAt: toInputDateTime(
                availability.endAt,
            ),
            status:
                availability.status === "UNAVAILABLE"
                    ? "UNAVAILABLE"
                    : "AVAILABLE",
        };

        setForm(formData);
        setInitialEditingForm(formData);
    };

    const handleDelete = async (
        availabilityId: string,
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this availability period?",
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(availabilityId);

        try {
            await apiFetch<Availability>(
                endpoints.availability.delete(
                    availabilityId,
                ),
                {
                    method: "DELETE",
                },
            );

            setAvailabilities((previous) =>
                previous.filter(
                    (availability) =>
                        availability.id !==
                        availabilityId,
                ),
            );

            if (editingId === availabilityId) {
                resetForm();
            }

            toast.success(
                "Availability deleted successfully.",
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        } finally {
            setDeletingId(null);
        }
    };

    const isFormUnchanged =
        editingId !== null &&
        form.startAt === initialEditingForm.startAt &&
        form.endAt === initialEditingForm.endAt &&
        form.status === initialEditingForm.status;

    return (
        <div className="space-y-6 text-slate-100">
            <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <CardHeader className="border-b border-white/10 bg-slate-950/40 px-6 py-4">
                    <CardTitle className="text-sm font-bold tracking-wide text-white uppercase">
                        {editingId
                            ? "Edit Availability"
                            : "Add Availability"}
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-400">
                        Set a time period when you can accept
                        service jobs.
                    </p>
                </CardHeader>

                <CardContent className="p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        <div>
                            <label
                                htmlFor="startAt"
                                className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                            >
                                Start time
                            </label>

                            <Input
                                id="startAt"
                                type="datetime-local"
                                value={form.startAt}
                                onChange={(event) =>
                                    handleChange(
                                        "startAt",
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus-visible:ring-1 focus-visible:ring-teal-400"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="endAt"
                                className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                            >
                                End time
                            </label>

                            <Input
                                id="endAt"
                                type="datetime-local"
                                value={form.endAt}
                                onChange={(event) =>
                                    handleChange(
                                        "endAt",
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus-visible:ring-1 focus-visible:ring-teal-400"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="mb-1.5 block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                            >
                                Status
                            </label>

                            <Select
                                value={form.status}
                                onValueChange={(value) =>
                                    handleChange(
                                        "status",
                                        value as AvailabilityStatus,
                                    )
                                }
                            >
                                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus:ring-1 focus:ring-teal-400">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl">
                                    <SelectItem value="AVAILABLE">
                                        Available
                                    </SelectItem>
                                    <SelectItem value="UNAVAILABLE">
                                        Unavailable
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-3 md:col-span-3 pt-2">
                            <Button
                                type="submit"
                                disabled={isSaving || isFormUnchanged}
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-500 px-5 text-xs font-semibold text-slate-950 transition-all hover:bg-teal-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-teal-500/20"
                            >
                                <Plus className="mr-2 size-4" />
                                {isSaving
                                    ? "Saving..."
                                    : editingId
                                      ? "Update Availability"
                                      : "Add Availability"}
                            </Button>

                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950 px-5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                                >
                                    <X className="mr-2 size-4" />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <CardHeader className="border-b border-white/10 bg-slate-950/40 px-6 py-4">
                    <CardTitle className="text-sm font-bold tracking-wide text-white uppercase">
                        My Availability
                    </CardTitle>
                </CardHeader>

                {availabilities.length === 0 ? (
                    <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                            <Calendar className="size-6 text-teal-400" />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                            No availability periods yet.
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                            Add your first availability period
                            above.
                        </p>
                    </CardContent>
                ) : (
                    <div className="divide-y divide-white/10">
                        {availabilities.map(
                            (availability) => (
                                <div
                                    key={availability.id}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-white/5"
                                >
                                    <div>
                                        <p className="font-bold text-white text-xs sm:text-sm">
                                            {formatDateTime(
                                                availability.startAt,
                                            )}{" "}
                                            —{" "}
                                            {formatDateTime(
                                                availability.endAt,
                                            )}
                                        </p>

                                        <Badge
                                            variant={
                                                availability.status ===
                                                "AVAILABLE"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                                                availability.status ===
                                                "AVAILABLE"
                                                    ? "border border-teal-400/30 bg-teal-400/15 text-teal-300"
                                                    : "border border-red-400/30 bg-red-400/15 text-red-300"
                                            }`}
                                        >
                                            <span
                                                className={`size-1.5 rounded-full ${
                                                    availability.status ===
                                                    "AVAILABLE"
                                                        ? "bg-teal-400 animate-pulse"
                                                        : "bg-red-400"
                                                }`}
                                            />
                                            {availability.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleEdit(
                                                    availability,
                                                )
                                            }
                                            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                                        >
                                            <Edit3 className="size-3.5 text-teal-400" />
                                            Edit
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                handleDelete(
                                                    availability.id,
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                availability.id
                                            }
                                            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-4 text-xs font-semibold text-red-300 transition-all hover:bg-red-950 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Trash2 className="size-3.5 text-red-400" />
                                            {deletingId ===
                                            availability.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </Button>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}