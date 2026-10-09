"use client";

import type { NotificationListResponse } from "@/types/notification";

import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

interface AdminNotificationsProps {
    initialData: NotificationListResponse;
}

export default function AdminNotifications({
    initialData,
}: AdminNotificationsProps) {
    const {
        data,
        isLoading,
        isError,
        markAsReadMutation,
        markAllAsReadMutation,
    } = useNotifications(initialData);

    if (isLoading) {
        return (
           <div className="h-72 w-full animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl" />
        );
    }

    if (isError) {
        return (
            <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/40 p-10 text-center shadow-2xl backdrop-blur-xl">
                <p className="text-sm font-semibold text-red-200">
                    Failed to load notifications.
                </p>
            </div>
        );
    }

    const notifications = data?.data ?? [];

    return (
       <section className="space-y-6 text-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-teal-400">
                        <Bell className="size-4 sm:size-5" />
                        <span className="text-xs font-semibold tracking-wide sm:text-sm">
                            System Alerts
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Notifications
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Platform notifications for your account.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        markAllAsReadMutation.mutate()
                    }
                    disabled={
                        markAllAsReadMutation.isPending ||
                        notifications.every(
                            (notification) =>
                                notification.isRead,
                        )
                    }
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 backdrop-blur-xl shadow-lg"
                >
                    {markAllAsReadMutation.isPending
                        ? "Marking..."
                        : "Mark all as read"}
                </button>
            </div>

            {notifications.length === 0 ? (
                <Empty />
            ) : (
                <div className="space-y-3">
                    {notifications.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                if (!item.isRead) {
                                    markAsReadMutation.mutate(
                                        item.id,
                                    );
                                }
                            }}
                            disabled={
                                markAsReadMutation.isPending
                            }
                            className={`w-full rounded-2xl border p-5 text-left transition-all backdrop-blur-xl shadow-xl ${
                                item.isRead
                                    ? "border-white/10 bg-slate-900/60 text-slate-300 hover:bg-slate-900/90"
                                    : "border-teal-500/30 bg-slate-900/90 text-white hover:bg-slate-900 ring-1 ring-teal-500/20"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="font-bold text-white text-sm sm:text-base">
                                    {item.title}
                                </h2>

                                {!item.isRead && (
                                    <span className="mt-1 size-2 shrink-0 rounded-full bg-teal-400 animate-pulse" />
                                )}
                            </div>

                            <p className="mt-1 text-xs sm:text-sm text-slate-400">
                                {item.message}
                            </p>

                            <p className="mt-3 text-[10px] sm:text-xs font-medium text-slate-500">
                                {new Date(
                                    item.createdAt,
                                ).toLocaleString()}
                            </p>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

function Empty() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                <Bell className="size-6 text-teal-400" />
            </div>

            <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                No notifications found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                No notifications found.
            </p>
        </div>
    );
}