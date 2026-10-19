import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, UserPlus } from "lucide-react";

import ServiceAssistant from "@/components/ai/ServiceAssistant";
import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

export const metadata: Metadata = {
    title: "AI Service Assistant | Servexa",
    description:
        "Ask Servexa about available services and get guidance on choosing a service.",
};

interface CurrentUser {
    id: string;
    email: string;
    role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
    isActive: boolean;
}

function getDashboardPath(role: CurrentUser["role"]) {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin";

        case "TECHNICIAN":
            return "/dashboard/technician";

        case "CUSTOMER":
        default:
            return "/dashboard/customer";
    }
}

async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        return await serverApiFetch<CurrentUser>(endpoints.auth.me);
    } catch {
        return null;
    }
}

export default async function AiAssistantPage() {
    const currentUser = await getCurrentUser();

    const dashboardPath = currentUser
        ? getDashboardPath(currentUser.role)
        : null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 selection:bg-teal-500 selection:text-slate-950 sm:px-6 lg:py-16">
            {/* Background Ambient Glows for UI Consistency */}
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full max-w-5xl -translate-x-1/2 opacity-20 blur-[130px] [background:radial-gradient(circle_at_50%_0%,#2dd4bf_0%,transparent_70%)]" />

            <div className="mx-auto max-w-4xl space-y-10">
                {/* Header Section */}
                <div className="space-y-6">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-teal-400"
                    >
                        <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        Back to Servexa
                    </Link>

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500" />

                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(45,212,191,0.08),transparent_50%)]" />

                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold text-teal-300 shadow-sm backdrop-blur-md">
                                <Sparkles className="size-3.5 text-teal-400" />
                                <span>Service guidance</span>
                            </div>

                            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Find the right service with AI
                            </h1>

                            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                                Get guidance based on Servexa&apos;s available
                                services. The assistant can help you understand
                                the catalog, but it cannot book a service or
                                confirm availability.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main AI Assistant Interactive Container */}
                <ServiceAssistant />

                {/* Bottom Call-To-Action Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(45,212,191,0.05),transparent_50%)]" />

                    <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <h2 className="text-lg font-bold text-white sm:text-xl">
                                Ready to request a service?
                            </h2>

                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                                {currentUser?.role === "CUSTOMER"
                                    ? "Continue to your customer dashboard to create a service request using your saved address and the normal request workflow."
                                    : currentUser
                                      ? "Access your dashboard to manage your Servexa activities."
                                      : "Sign in as a customer to create a service request using your saved address and the normal request workflow."}
                            </p>
                        </div>

                        {!currentUser ? (
                            <Link
                                href="/auth/login"
                                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98]"
                            >
                                <UserPlus className="size-4" />
                                Sign in
                            </Link>
                        ) : currentUser.role === "CUSTOMER" ? (
                            <Link
                                href="/dashboard/customer/services"
                                className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98]"
                            >
                                Request a service
                            </Link>
                        ) : (
                            <Link
                                href={dashboardPath!}
                                className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98]"
                            >
                                Open dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}