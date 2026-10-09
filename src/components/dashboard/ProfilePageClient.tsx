"use client";

import { Loader2, ShieldAlert } from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CustomerProfileForm } from "../customer/CutomerProfileForm";
import { TechnicianProfileForm } from "../technician/TechnicianProfileForm";
import { AdminProfile } from "../admin/AdminProfile";

export function ProfilePageClient() {
    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center text-teal-400">
                <Loader2 className="size-8 animate-spin" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-xs text-red-200 backdrop-blur-xl">
                <ShieldAlert className="size-5 shrink-0 text-red-400 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-bold text-red-300">Profile Error</p>
                    <p className="text-red-300/80">
                        {error instanceof Error
                            ? error.message
                            : "Unable to load your profile."}
                    </p>
                </div>
            </div>
        );
    }

    if (user.role === "CUSTOMER") {
        return <CustomerProfileForm />;
    }

    if (user.role === "TECHNICIAN") {
        return <TechnicianProfileForm user={user} />;
    }

    return <AdminProfile user={user} />;
}