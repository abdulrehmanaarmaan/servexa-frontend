import type { PaginationMeta } from "@/types/api";

export const WORK_ORDER_STATUSES = [
    "OPEN",
    "SCHEDULED",
    "ASSIGNED",
    "EN_ROUTE",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "CANCELLED",
] as const;

export type WorkOrderStatus =
    (typeof WORK_ORDER_STATUSES)[number];

export const WORK_ORDER_SORT_FIELDS = [
    "createdAt",
    "scheduledStart",
    "updatedAt",
] as const;

export type WorkOrderSortField =
    (typeof WORK_ORDER_SORT_FIELDS)[number];

export type SortOrder = "asc" | "desc";

export interface WorkOrderCustomer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

export interface WorkOrderService {
    id: string;
    name: string;
    description?: string | null;
    basePrice?: number | string | null;
    isActive?: boolean;
}

export interface WorkOrderAddress {
    id: string;
    label?: string;
    addressLine?: string;
    area?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
}

export interface WorkOrderTechnician {
    id: string;
    userId?: string;
    name?: string;
    phone?: string;
    email?: string;
    employeeCode?: string;
}

export interface WorkOrderAssignment {
    id: string;
    workOrderId: string;
    technicianId: string;
    assignedAt: string;
    unassignedAt?: string | null;
    technician?: WorkOrderTechnician;
}

export interface WorkOrderInvoice {
    id: string;
    invoiceNumber?: string;
    total?: number | string | null;
    status?: string;
}

export interface WorkOrderStatusHistory {
    id: string;
    workOrderId?: string;
    fromStatus?: WorkOrderStatus | null;
    toStatus: WorkOrderStatus;
    reason?: string | null;
    changedAt: string;
}

export interface WorkOrderNote {
    id: string;
    workOrderId?: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

export interface WorkOrderServiceRequest {
    id: string;
}

export interface WorkOrder {
    id: string;

    serviceRequestId: string;
    customerId: string;
    serviceId: string;
    addressId: string;

    servicePrice?: number | string | null;

    status: WorkOrderStatus;

    scheduledStart?: string | null;
    scheduledEnd?: string | null;

    description?: string | null;

    createdAt: string;
    updatedAt: string;

    customer?: WorkOrderCustomer;
    service?: WorkOrderService;
    address?: WorkOrderAddress;

    assignments?: WorkOrderAssignment[];

    invoice?: WorkOrderInvoice | null;

    statusHistory?: WorkOrderStatusHistory[];

    notes?: WorkOrderNote[];

    serviceRequest?: WorkOrderServiceRequest | null;
}

export interface WorkOrderQuery {
    page?: number;
    limit?: number;
    status?: WorkOrderStatus;
    sortBy?: WorkOrderSortField;
    sortOrder?: SortOrder;
}

export type TechnicianWorkOrderQuery =
    WorkOrderQuery;

export interface WorkOrdersResponse {
    data: WorkOrder[];
    meta: PaginationMeta;
}

export type TechnicianWorkOrdersResponse =
    WorkOrdersResponse;

export interface UpdateWorkOrderPayload {
    description?: string;
}

export interface UpdateWorkOrderStatusPayload {
    status: WorkOrderStatus;
    reason?: string;
}

export interface ScheduleWorkOrderPayload {
    scheduledStart: string;
    scheduledEnd: string;
}