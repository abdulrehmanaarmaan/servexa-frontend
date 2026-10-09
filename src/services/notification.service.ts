import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";

import type {
    Notification,
    NotificationListResponse,
} from "@/types/notification";

export async function getNotifications(
    params?: {
        page?: number;
        limit?: number;
        isRead?: boolean;
    },
): Promise<NotificationListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
        searchParams.set("page", String(params.page));
    }

    if (params?.limit !== undefined) {
        searchParams.set("limit", String(params.limit));
    }

    if (params?.isRead !== undefined) {
        searchParams.set("isRead", String(params.isRead));
    }

    const queryString = searchParams.toString();

    const endpoint = queryString
        ? `${endpoints.notifications.list}?${queryString}`
        : endpoints.notifications.list;

    return apiFetch<NotificationListResponse>(endpoint);
}

export async function markNotificationAsRead(
    notificationId: string,
): Promise<Notification> {
    return apiFetch<Notification>(
        endpoints.notifications.markAsRead(notificationId),
        {
            method: "PATCH",
        },
    );
}

export async function markAllNotificationsAsRead(): Promise<null> {
    return apiFetch<null>(
        endpoints.notifications.markAllAsRead,
        {
            method: "PATCH",
        },
    );
}