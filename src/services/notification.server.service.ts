import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

import type {
    NotificationListResponse,
} from "@/types/notification";

export async function getNotificationsServer(
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
        searchParams.set(
            "isRead",
            String(params.isRead),
        );
    }

    const queryString = searchParams.toString();

    const endpoint = queryString
        ? `${endpoints.notifications.list}?${queryString}`
        : endpoints.notifications.list;

    return serverApiFetch<NotificationListResponse>(
        endpoint,
    );
}