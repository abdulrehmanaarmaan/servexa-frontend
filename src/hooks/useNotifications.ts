"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/notification.service";

import type {
    NotificationListResponse,
} from "@/types/notification";

export const notificationQueryKey = ["notifications"];

export function useNotifications(
    initialData?: NotificationListResponse,
) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: notificationQueryKey,
        queryFn: () => getNotifications(),
        initialData,
        staleTime: 30_000,
    });

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationQueryKey,
            });
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationQueryKey,
            });

            toast.success(
                "All notifications marked as read.",
            );
        },

        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return {
        ...query,
        markAsReadMutation,
        markAllAsReadMutation,
    };
}