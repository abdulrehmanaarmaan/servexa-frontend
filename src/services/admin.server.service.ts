import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

import type { AdminDashboard, AdminTechnician } from "@/types/dashboard";

export async function getAdminDashboard(): Promise<AdminDashboard> {
    return serverApiFetch<AdminDashboard>(
        endpoints.admin.dashboard,
    );
}

export async function getAdminTechniciansServer(): Promise<
    AdminTechnician[]
> {
    return serverApiFetch<AdminTechnician[]>(
        endpoints.admin.technicians,
    );
}