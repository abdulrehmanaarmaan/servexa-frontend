import "server-only";

import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

import type { WorkOrder } from "@/types/work-order";

export const workOrderServerService = {
    getById(id: string) {
        return serverApiFetch<WorkOrder>(
            endpoints.workOrders.detail(id),
        );
    },
};