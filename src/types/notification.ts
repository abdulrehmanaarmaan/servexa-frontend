export type NotificationType =
    | "SERVICE_REQUEST"
    | "WORK_ORDER"
    | "ASSIGNMENT"
    | "SCHEDULE"
    | "STATUS_UPDATE"
    | "INVOICE"
    | "PAYMENT"
    | "SYSTEM";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationListResponse {
    data: Notification[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}