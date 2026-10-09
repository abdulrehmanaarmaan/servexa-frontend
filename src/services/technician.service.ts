import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";

import type { Technician } from "@/types/technician";
import type { TechnicianProfile } from "@/types/technician";

export interface UpdateTechnicianProfilePayload {
    name?: string;
    phone?: string;
}

export const technicianService = {
    // Keep your existing list() here...

    list(params?: {
        search?: string;
        available?: boolean;
        page?: number;
        limit?: number;
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

        if (params?.search) {
            query.set(
                "search",
                params.search,
            );
        }

        if (
            params?.available !== undefined
        ) {
            query.set(
                "available",
                String(params.available),
            );
        }

        return apiFetch<{
            data: Technician[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        }>(
            `${endpoints.technicians.list}?${query}`,
        );
    },

    detail(id: string) {
        return apiFetch<Technician>(
            endpoints.technicians.byId(id),
        );
    },

    getMyProfile() {
        return apiFetch<TechnicianProfile>(
            endpoints.technicians.profile,
        );
    },

    updateMyProfile(
        payload: UpdateTechnicianProfilePayload,
    ) {
        return apiFetch<TechnicianProfile>(
            endpoints.technicians.updateProfile,
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            },
        );
    },
};