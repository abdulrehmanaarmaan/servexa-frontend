"use client";

import { Bell, Loader2 } from "lucide-react";

import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationListResponse } from "@/types/notification";

interface CustomerNotificationsClientProps {
    initialData: NotificationListResponse;
}

export default function CustomerNotificationsClient({
    initialData,
}: CustomerNotificationsClientProps) {
    const {
        data,
        isFetching,
        markAsReadMutation,
        markAllAsReadMutation,
    } = useNotifications(initialData);

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
                            System Alerts
                        </span>
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                        Notifications
                    </h1>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                        Stay updated with your Servexa activity.
                    </p>
                </div>

                {hasUnreadNotifications && (
                    <button
                        type="button"
                        onClick={() =>
                            markAllAsReadMutation.mutate()
                        }
                        disabled={
                            markAllAsReadMutation.isPending
                        }
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 backdrop-blur-xl shadow-lg"
                    >
                        {markAllAsReadMutation.isPending
                            ? "Marking..."
                            : "Mark all as read"}
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                        <Bell className="size-6 text-teal-400" />
                    </div>

                    <p className="mt-4 text-base font-bold text-white sm:text-lg">
                        No notifications
                    </p>

                    <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                        You are all caught up.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        const isMarkingThisNotification =
                            markAsReadMutation.isPending &&
                            markAsReadMutation.variables ===
                                notification.id;

                        return (
                            <div
                                key={notification.id}
                                className={`relative overflow-hidden rounded-2xl border p-6 transition-all backdrop-blur-xl shadow-xl ${
                                    notification.isRead
                                        ? "border-white/10 bg-slate-900/60 text-slate-300 hover:bg-slate-900/90"
                                        : "border-teal-500/30 bg-slate-900/90 text-white hover:bg-slate-900 ring-1 ring-teal-500/20"
                                }`}
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            {!notification.isRead && (
                                                <span
                                                    aria-hidden="true"
                                                    className="size-2 shrink-0 rounded-full bg-teal-400 animate-pulse"
                                                />
                                            )}

                                            <h3 className="font-bold text-white text-sm sm:text-base">
                                                {
                                                    notification.title
                                                }
                                            </h3>
                                        </div>

                                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                                            {
                                                notification.message
                                            }
                                        </p>
                                    </div>

                                    <time
                                        dateTime={
                                            notification.createdAt
                                        }
                                        className="shrink-0 text-[10px] sm:text-xs font-medium text-slate-500"
                                    >
                                        {new Date(
                                            notification.createdAt,
                                        ).toLocaleDateString()}
                                    </time>
                                </div>

                                {!notification.isRead && (
                                    <div className="mt-4 flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                markAsReadMutation.mutate(
                                                    notification.id,
                                                )
                                            }
                                            disabled={
                                                markAsReadMutation.isPending
                                            }
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {isMarkingThisNotification && (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            )}
                                            {isMarkingThisNotification
                                                ? "Marking..."
                                                : "Mark as read"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {isFetching && !markAllAsReadMutation.isPending && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Loader2 className="size-3.5 animate-spin text-teal-400" />
                    Updating notifications...
                </div>
            )}
        </section>
    );
}