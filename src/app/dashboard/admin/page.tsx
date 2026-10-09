import Link from "next/link";
import {
    Users,
    Wrench,
    ClipboardList,
    CreditCard,
    ShieldAlert,
    FileText,
    UserRoundCog,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import { getAdminDashboard } from "@/services/admin.server.service";

const adminActions = [
    {
        href: "/dashboard/admin/users",
        icon: Users,
        title: "Manage users",
        description: "Review users and manage account access.",
    },
    {
        href: "/dashboard/admin/technicians",
        icon: Wrench,
        title: "Technicians",
        description: "Manage technician accounts and status.",
    },
    {
        href: "/dashboard/admin/requests",
        icon: ClipboardList,
        title: "Service requests",
        description: "Review incoming customer requests.",
    },
    {
        href: "/dashboard/admin/work-orders",
        icon: FileText,
        title: "Work orders",
        description: "Monitor and manage active work orders.",
    },
    {
        href: "/dashboard/admin/assignments",
        icon: UserRoundCog,
        title: "Assignments",
        description: "Assign technicians to work orders.",
    },
    {
        href: "/dashboard/admin/payments",
        icon: CreditCard,
        title: "Payments",
        description: "Review payment activity and status.",
    },
];

export default async function AdminDashboard() {
    const data = await getAdminDashboard();

    return (
        <section className="space-y-8 text-slate-100">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(45,212,191,0.08),transparent_50%)]" />
                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                            <ShieldAlert className="size-3.5 text-teal-400" />
                            Operations
                        </div>

                        <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                            Admin dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                            Monitor Servexa operations, users and service delivery.
                        </p>
                    </div>
                </div>
            </div>

            {/* Overview / Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={data.users.total}
                    icon={Users}
                />

                <StatCard
                    title="Technicians"
                    value={data.technicians.total}
                    icon={Wrench}
                />

                <StatCard
                    title="Pending Requests"
                    value={data.serviceRequests.pending}
                    icon={ClipboardList}
                />

                <StatCard
                    title="Paid Payments"
                    value={data.payments.paid}
                    icon={CreditCard}
                />
            </div>

            {/* Quick actions */}
            <div className="space-y-5">
                <div>
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        Quick actions
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Jump directly to the areas that need your attention.
                    </p>
                </div>

                {adminActions.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-16 text-center shadow-xl backdrop-blur-xl">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                            <ShieldAlert className="size-6" />
                        </div>

                        <h3 className="mt-5 text-base font-bold text-white sm:text-lg">
                            No quick actions available
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                            There are currently no administrative shortcut modules enabled.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {adminActions.map((action) => (
                            <AdminQuickAction
                                key={action.title}
                                href={action.href}
                                icon={action.icon}
                                title={action.title}
                                description={action.description}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function AdminQuickAction({
    href,
    icon: Icon,
    title,
    description,
}: {
    href: string;
    icon: typeof Users;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-teal-500/5 sm:p-7"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
            
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

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-teal-400 transition-colors group-hover:text-teal-300">
                <span>Open module</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
        </Link>
    );
}