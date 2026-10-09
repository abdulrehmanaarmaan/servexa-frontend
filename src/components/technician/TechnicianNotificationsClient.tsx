"use client";

import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationListResponse } from "@/types/notification";
import { Bell, CheckCheck, AlertCircle } from "lucide-react";

interface TechnicianNotificationsClientProps {
    initialData: NotificationListResponse;
}

export default function TechnicianNotificationsClient({
    initialData,
}: TechnicianNotificationsClientProps) {
    const {
        data,
        isLoading,
        isError,
        markAsReadMutation,
        markAllAsReadMutation,
    } = useNotifications(initialData);

    if (isLoading) {
        return (
            <section className="space-y-6 text-slate-100">
                <div className="flex flex-col gap-2">
                    <div className="h-5 w-40 animate-pulse rounded-md bg-white/10" />
                    <div className="h-8 w-64 animate-pulse rounded-xl bg-white/10" />
                    <div className="h-4 w-96 animate-pulse rounded-md bg-white/10" />
                </div>

                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-28 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
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
                        <Bell className="size-4 sm:size-5" />
                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            Account Center
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Notifications
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Updates related to your technician account.
                    </p>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-xs text-red-200 backdrop-blur-xl">
                    <AlertCircle className="size-5 shrink-0 text-red-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-bold text-red-300">Failed to load notifications</p>
                        <p className="text-red-300/80">Please check your network connection and try again.</p>
                    </div>
                </div>
            </section>
        );
    }

    const notifications = data?.data ?? [];

    const hasUnreadNotifications = notifications.some(
        (notification) => !notification.isRead,
    );

    return (
        <section className="space-y-6 text-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-teal-400">
                        <Bell className="size-4 sm:size-5" />
                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            Account Center
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Notifications
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Updates related to your technician account.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={
                        markAllAsReadMutation.isPending ||
                        !hasUnreadNotifications
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-black/20"
                >
                    <CheckCheck className="size-4 text-teal-400" />
                    {markAllAsReadMutation.isPending
                        ? "Marking as read..."
                        : "Mark all as read"}
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                            <Bell className="size-6 text-teal-400" />
                        </div>

                        <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                            No notifications
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                            You do not have any notifications right now.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                                if (
                                    !notification.isRead &&
                                    !markAsReadMutation.isPending
                                ) {
                                    markAsReadMutation.mutate(
                                        notification.id,
                                    );
                                }
                            }}
                            disabled={
                                notification.isRead ||
                                markAsReadMutation.isPending
                            }
                            className={`w-full rounded-2xl border p-5 text-left transition-all backdrop-blur-xl ${
                                notification.isRead
                                    ? "border-white/10 bg-slate-900/40 opacity-75 hover:bg-slate-900/60"
                                    : "border-white/15 bg-slate-900/90 shadow-xl hover:bg-slate-900 hover:border-teal-400/40"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h2 className="font-bold text-white text-sm sm:text-base">
                                        {notification.title}
                                    </h2>

                                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-300">
                                        {notification.message}
                                    </p>

                                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-teal-400 uppercase">
                                        <span className="size-1.5 rounded-full bg-teal-400" />
                                        {notification.type.replace(
                                            /_/g,
                                            " ",
                                        )}
                                    </p>
                                </div>

                                {!notification.isRead && (
                                    <span className="mt-1 size-2.5 shrink-0 rounded-full bg-teal-400 ring-4 ring-teal-400/20 animate-pulse" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}