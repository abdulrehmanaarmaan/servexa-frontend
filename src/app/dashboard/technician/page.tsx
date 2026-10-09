import Link from "next/link";

import {
    ClipboardList,
    CalendarClock,
    Bell,
    User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const technicianCards = [
    {
        icon: ClipboardList,
        title: "Assigned jobs",
        description: "View jobs assigned to you and update their workflow status.",
        href: "/dashboard/technician/jobs",
        buttonLabel: "View jobs",
        variant: "default" as const,
    },
    {
        icon: CalendarClock,
        title: "Availability",
        description: "Keep your working availability up to date.",
        href: "/dashboard/technician/availability",
        buttonLabel: "Manage availability",
        variant: "outline" as const,
    },
];

export default function TechnicianDashboard() {
    return (
        <section className="space-y-8 text-slate-100">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(45,212,191,0.08),transparent_50%)]" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                        Technician workspace
                    </div>

                    <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                        My field operations
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                        Manage assigned work orders and your availability.
                    </p>
                </div>
            </div>

            {/* Primary operations */}
            <div className="space-y-5">
                <div>
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        Field operations
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Manage your assigned jobs and working availability.
                    </p>
                </div>

                {technicianCards.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-16 text-center shadow-xl backdrop-blur-xl">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                            <ClipboardList className="size-6" />
                        </div>

                        <h3 className="mt-5 text-base font-bold text-white sm:text-lg">
                            No operations available
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                            There are currently no operations or active modules configured for your workspace.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {technicianCards.map((card) => (
                            <TechnicianCard
                                key={card.title}
                                icon={card.icon}
                                title={card.title}
                                description={card.description}
                                href={card.href}
                                buttonLabel={card.buttonLabel}
                                variant={card.variant}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Secondary navigation */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl">
                <div>
                    <h2 className="text-base font-bold text-white sm:text-lg">
                        Account
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Stay updated and manage your technician profile.
                    </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/dashboard/technician/notifications">
                        <Button variant="outline" className="border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white">
                            <Bell className="mr-2 size-4 text-teal-400" />
                            Notifications
                        </Button>
                    </Link>

                    <Link href="/dashboard/profile">
                        <Button variant="outline" className="border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white">
                            <User className="mr-2 size-4 text-teal-400" />
                            Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function TechnicianCard({
    icon: Icon,
    title,
    description,
    href,
    buttonLabel,
    variant = "default",
}: {
    icon: typeof ClipboardList;
    title: string;
    description: string;
    href: string;
    buttonLabel: string;
    variant?: "default" | "outline";
}) {
    return (
        <Card className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-teal-500/5">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-teal-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="flex h-full flex-col justify-between space-y-6 p-6 sm:p-7">
                <div className="space-y-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                        <Icon className="size-5" />
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-white transition-colors group-hover:text-teal-300 sm:text-lg">
                            {title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                            {description}
                        </p>
                    </div>
                </div>

                <div>
                    <Link href={href} className="inline-block w-full">
                        <Button
                            variant={variant}
                            className={
                                variant === "default"
                                    ? "w-full bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold shadow-lg shadow-teal-500/20"
                                    : "w-full border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                            }
                        >
                            {buttonLabel}
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}