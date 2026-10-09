import { endpoints } from "@/lib/endpoints";
import {
    apiFetch,
    apiFetchResponse,
} from "@/lib/api";

import type {
    AdminAuditLogsResponse,
    AdminDashboard,
    AdminTechnician,
} from "@/types/dashboard";

export async function getAdminDashboard(): Promise<AdminDashboard> {
    return apiFetch<AdminDashboard>(
        endpoints.admin.dashboard,
    );
}

export async function getAdminTechnicians(): Promise<
    AdminTechnician[]
> {
    return apiFetch<AdminTechnician[]>(
        endpoints.admin.technicians,
    );
}

export async function updateAdminTechnicianStatus(
    technicianId: string,
    isActive: boolean,
): Promise<AdminTechnician> {
    return apiFetch<AdminTechnician>(
        endpoints.admin.technicianStatus(
            technicianId,
        ),
        {
            method: "PATCH",
            body: JSON.stringify({
                isActive,
            }),
        },
    );
}

export async function getAdminAuditLogs(
    params?: {
        page?: number;
        limit?: number;
        entity?: string;
        entityId?: string;
        actorId?: string;
    },
): Promise<AdminAuditLogsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
        searchParams.set(
            "page",
            String(params.page),
        );
    }

    if (params?.limit !== undefined) {
        searchParams.set(
            "limit",
            String(params.limit),
        );
    }

    if (params?.entity) {
        searchParams.set(
            "entity",
            params.entity,
        );
    }

    if (params?.entityId) {
        searchParams.set(
            "entityId",
            params.entityId,
        );
    }

    if (params?.actorId) {
        searchParams.set(
            "actorId",
            params.actorId,
        );
    }

    const queryString =
        searchParams.toString();

    const endpoint = queryString
        ? `${endpoints.admin.auditLogs}?${queryString}`
        : endpoints.admin.auditLogs;

    const response = await apiFetchResponse<
        AdminAuditLogsResponse["data"],
        AdminAuditLogsResponse["meta"]
    >(endpoint);

    if (!response.meta) {
        throw new Error(
            "Audit log pagination metadata is missing.",
        );
    }

    return {
        data: response.data,
        meta: response.meta,
    };
}