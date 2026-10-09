"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
    useCustomerProfile,
    useUpdateCustomerProfile,
} from "@/hooks/useCustomer";

const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name cannot exceed 100 characters."),

    phone: z
        .string()
        .trim()
        .min(7, "Phone number is too short.")
        .max(20, "Phone number is too long."),

    company: z
        .string()
        .trim()
        .max(150, "Company name cannot exceed 150 characters.")
        .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
    const {
        data: profile,
        isLoading,
        isError,
        error,
    } = useCustomerProfile();

    const updateProfile = useUpdateCustomerProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            phone: "",
            company: "",
        },
    });

    useEffect(() => {
        if (!profile) return;

        reset({
            name: profile.name ?? "",
            phone: profile.phone ?? "",
            company: profile.company ?? "",
        });
    }, [profile, reset]);

    const onSubmit = (values: ProfileFormValues) => {
        updateProfile.mutate(values, {
            onSuccess: () => {
                toast.success(
                    "Profile updated successfully.",
                );
            },

            onError: (mutationError) => {
                toast.error(
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Failed to update profile.",
                );
            },
        });
    };

    if (isLoading) {
        return <ProfileFormSkeleton />;
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h2 className="font-semibold text-red-800">
                    Unable to load your profile
                </h2>

                <p className="mt-1 text-sm text-red-600">
                    {error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again."}
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Full name
                    </label>

                    <input
                        id="name"
                        {...register("name")}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Phone
                    </label>

                    <input
                        id="phone"
                        {...register("phone")}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />

                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="company"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Company
                    </label>

                    <input
                        id="company"
                        {...register("company")}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />

                    {errors.company && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.company.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {updateProfile.isPending
                        ? "Saving..."
                        : "Save changes"}
                </button>
            </div>
        </form>
    );
}

function ProfileFormSkeleton() {
    return (
        <div className="max-w-2xl animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                    <div className="h-10 rounded-lg bg-slate-200" />
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                    <div className="h-10 rounded-lg bg-slate-200" />
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                    <div className="h-10 rounded-lg bg-slate-200" />
                </div>
            </div>
        </div>
    );
}