import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";

import type {
    ScheduleWorkOrderPayload,
    UpdateWorkOrderPayload,
    UpdateWorkOrderStatusPayload,
    WorkOrder,
    WorkOrderQuery,
    WorkOrdersResponse,
} from "@/types/work-order";

function buildQuery(
    params: WorkOrderQuery = {},
) {
    const query = new URLSearchParams();

    query.set(
        "page",
        String(params.page ?? 1),
    );

    query.set(
        "limit",
        String(params.limit ?? 10),
    );

    if (params.status) {
        query.set(
            "status",
            params.status,
        );
    }

    query.set(
        "sortBy",
        params.sortBy ?? "createdAt",
    );

    query.set(
        "sortOrder",
        params.sortOrder ?? "desc",
    );

    return query.toString();
}

export const workOrderService = {
    /**
     * ADMIN: GET /work-orders
     */
    getAllWorkOrders(
        params: WorkOrderQuery = {},
    ) {
        return apiFetch<WorkOrdersResponse>(
            `${endpoints.workOrders.list}?${buildQuery(params)}`,
        );
    },

    /**
     * CUSTOMER: GET /work-orders/customers/me
     */
    getMyCustomerWorkOrders(
        params: WorkOrderQuery = {},
    ) {
        return apiFetch<WorkOrdersResponse>(
            `${endpoints.workOrders.customerList}?${buildQuery(params)}`,
        );
    },

    /**
     * TECHNICIAN: GET /work-orders/technicians/me
     */
    getMyTechnicianWorkOrders(
        params: WorkOrderQuery = {},
    ) {
        return apiFetch<WorkOrdersResponse>(
            `${endpoints.workOrders.technicianList}?${buildQuery(params)}`,
        );
    },

    /**
     * GET /work-orders/:id
     */
    getById(id: string) {
        return apiFetch<WorkOrder>(
            endpoints.workOrders.detail(id),
        );
    },

    /**
     * ADMIN: PATCH /work-orders/:id
     */
    updateWorkOrder(
        id: string,
        payload: UpdateWorkOrderPayload,
    ) {
        return apiFetch<WorkOrder>(
            endpoints.workOrders.detail(id),
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            },
        );
    },

    /**
     * ADMIN / TECHNICIAN:
     * PATCH /work-orders/:id/status
     */
    updateWorkOrderStatus(
        id: string,
        payload: UpdateWorkOrderStatusPayload,
    ) {
        return apiFetch<WorkOrder>(
            endpoints.workOrders.status(id),
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            },
        );
    },

    /**
     * ADMIN:
     * PATCH /work-orders/:id/schedule
     */
    scheduleWorkOrder(
        id: string,
        payload: ScheduleWorkOrderPayload,
    ) {
        return apiFetch<WorkOrder>(
            endpoints.workOrders.schedule(id),
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            },
        );
    },
};