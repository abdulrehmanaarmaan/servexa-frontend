"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { UserCircle, Shield, Mail, Phone, Building2, Save } from "lucide-react";

import {
    useCustomerProfile,
    useUpdateCustomerProfile,
} from "@/hooks/useCustomer";

const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name is too long."),

    phone: z
        .string()
        .trim()
        .min(7, "Phone number is too short.")
        .max(20, "Phone number is too long.")
        .or(z.literal("")),

    company: z
        .string()
        .trim()
        .max(150, "Company name is too long.")
        .or(z.literal("")),
});

type ProfileFormValues = z.infer<
    typeof profileSchema
>;

export function CustomerProfileForm() {
    const {
        data: profile,
        isLoading,
        isError,
    } = useCustomerProfile();

    const updateProfile =
        useUpdateCustomerProfile();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            name: profile?.name ?? "",
            phone: profile?.phone ?? "",
            company: profile?.company ?? "",
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-6 text-slate-100">
                <div className="flex flex-col gap-2">
                    <div className="h-5 w-40 animate-pulse rounded-md bg-white/10" />
                    <div className="h-8 w-64 animate-pulse rounded-xl bg-white/10" />
                </div>
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl" />
                    <div className="h-60 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl" />
                </div>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-xs text-red-200 backdrop-blur-xl">
                <Shield className="size-5 shrink-0 text-red-400 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-bold text-red-300">Loading Error</p>
                    <p className="text-red-300/80">Unable to load your customer profile.</p>
                </div>
            </div>
        );
    }

    const onSubmit = async (
        values: ProfileFormValues,
    ) => {
        try {
            await updateProfile.mutateAsync({
                name: values.name,
                phone: values.phone || undefined,
                company: values.company || undefined,
            });

            toast.success(
                "Profile updated successfully.",
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update profile.",
            );
        }
    };

    return (
        <div className="space-y-6 text-slate-100">
            <div>
                <div className="flex items-center gap-2 text-teal-400">
                    <UserCircle className="size-4 sm:size-5" />
                    <span className="text-xs font-semibold tracking-wide sm:text-sm">
                        Account Settings
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Profile
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Manage your personal and company information.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl"
                >
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                            >
                                Full name
                            </label>

                            <input
                                id="name"
                                {...form.register("name")}
                                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-200 outline-none transition focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400"
                            />

                            {form.formState.errors.name && (
                                <p className="mt-1.5 text-xs font-medium text-red-400">
                                    {
                                        form.formState
                                            .errors.name.message
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                            >
                                Phone
                            </label>

                            <input
                                id="phone"
                                {...form.register("phone")}
                                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-200 outline-none transition focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400"
                            />

                            {form.formState.errors.phone && (
                                <p className="mt-1.5 text-xs font-medium text-red-400">
                                    {
                                        form.formState
                                            .errors.phone.message
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="company"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300"
                            >
                                Company
                            </label>

                            <input
                                id="company"
                                {...form.register("company")}
                                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-200 outline-none transition focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400"
                            />

                            {form.formState.errors.company && (
                                <p className="mt-1.5 text-xs font-medium text-red-400">
                                    {
                                        form.formState
                                            .errors.company.message
                                    }
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={
                                updateProfile.isPending ||
                                !form.formState.isDirty
                            }
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 text-xs font-semibold text-slate-950 transition-all hover:bg-teal-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-teal-500/20"
                        >
                            <Save className="size-4" />
                            {updateProfile.isPending
                                ? "Saving..."
                                : "Save changes"}
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl h-fit">
                    <h2 className="text-sm font-bold tracking-wide text-white uppercase">
                        Account
                    </h2>

                    <div className="mt-5 space-y-4 text-xs sm:text-sm">
                        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <Mail className="size-3.5 text-teal-400" />
                                Email
                            </p>
                            <p className="mt-1.5 font-medium text-white">
                                {profile.userId
                                    ? "Your account email"
                                    : "—"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <Shield className="size-3.5 text-teal-400" />
                                Role
                            </p>
                            <p className="mt-1.5 font-medium text-white">
                                Customer
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}