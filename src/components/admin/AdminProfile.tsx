import type { User } from "@/types/auth";
import { UserCircle, Shield, Mail, Activity, Calendar, Info } from "lucide-react";

interface AdminProfileProps {
    user: User;
}

export function AdminProfile({
    user,
}: AdminProfileProps) {
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
                    View your administrator account information.
                </p>
            </div>

            <div className="max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <Mail className="size-3.5 text-teal-400" />
                            Email
                        </p>

                        <p className="mt-1.5 break-all font-medium text-white text-xs sm:text-sm">
                            {user.email}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <Shield className="size-3.5 text-teal-400" />
                            Role
                        </p>

                        <p className="mt-1.5 font-medium text-white text-xs sm:text-sm">
                            Administrator
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <Activity className="size-3.5 text-teal-400" />
                            Account status
                        </p>

                        <div className="mt-1.5 flex items-center gap-2 font-medium text-white text-xs sm:text-sm">
                            <span
                                className={`size-2 rounded-full ${
                                    user.isActive
                                        ? "bg-teal-400 animate-pulse"
                                        : "bg-red-400"
                                }`}
                            />
                            {user.isActive
                                ? "Active"
                                : "Inactive"}
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <Calendar className="size-3.5 text-teal-400" />
                            Account created
                        </p>

                        <p className="mt-1.5 font-medium text-white text-xs sm:text-sm">
                            {new Date(
                                user.createdAt,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-xs text-slate-300">
                    <Info className="size-4 shrink-0 text-teal-400 mt-0.5" />
                    <span>
                        Administrator profile editing is not
                        available because the current backend
                        does not expose an admin profile update
                        endpoint.
                    </span>
                </div>
            </div>
        </div>
    );
}