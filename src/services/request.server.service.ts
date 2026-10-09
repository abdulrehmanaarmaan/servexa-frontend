import "server-only";

import { serverApiFetch } from "@/lib/api-server";
import { endpoints } from "@/lib/endpoints";

import type { ServiceRequest } from "@/types/request";

export const serviceRequestServerService = {
    async getById(
        id: string,
    ): Promise<ServiceRequest> {
        return serverApiFetch<ServiceRequest>(
            endpoints.requests.detail(id),
        );
    },
};