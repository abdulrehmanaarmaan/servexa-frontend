import { apiFetch } from "@/lib/api";

import { endpoints } from "@/lib/endpoints";

import type {
    PaginatedData,
} from "@/types/api";

import type {
    ServicePriority,
    ServiceRequest,
} from "@/types/request";

export interface CreateServiceRequestPayload {
    serviceId: string;
    addressId: string;
    description: string;
    scheduledAt: string;
    priority: ServicePriority;
}

export const requestService = {
    list(params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }) {
        const query = new URLSearchParams();

        query.set(
            "page",
            String(params?.page ?? 1),
        );

        query.set(
            "limit",
            String(params?.limit ?? 10),
        );

        if (params?.status) {
            query.set(
                "status",
                params.status,
            );
        }

        if (params?.search) {
            query.set(
                "search",
                params.search,
            );
        }

        return apiFetch<
            PaginatedData<ServiceRequest>
        >(
            `${endpoints.requests.list}?${query.toString()}`,
        );
    },

    detail(id: string) {
        return apiFetch<ServiceRequest>(
            endpoints.requests.detail(id),
        );
    },

    create(
        payload: CreateServiceRequestPayload,
    ) {
        return apiFetch<ServiceRequest>(
            endpoints.requests.create,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    cancel(id: string) {
        return apiFetch<ServiceRequest>(
            endpoints.requests.cancel(id),
            {
                method: "POST",
            },
        );
    },
};