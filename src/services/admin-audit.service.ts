import { endpoints } from "@/lib/endpoints";
import { serverApiFetchResponse } from "@/lib/api-server";
import type { AdminAuditLogsResponse } from "@/types/dashboard";

interface GetAdminAuditLogsParams {
    page?: number;
    limit?: number;
    entity?: string;
    entityId?: string;
    actorId?: string;
}

export async function getAdminAuditLogs(
    params?: GetAdminAuditLogsParams,
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

    const queryString = searchParams.toString();

    const endpoint = queryString
        ? `${endpoints.admin.auditLogs}?${queryString}`
        : endpoints.admin.auditLogs;

    const response = await serverApiFetchResponse<
        AdminAuditLogsResponse["data"],
        AdminAuditLogsResponse["meta"]
    >(endpoint);

    return {
        data: response.data,
        meta: response.meta!,
    };
}