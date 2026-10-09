import { endpoints } from "@/lib/endpoints";
import {
    apiFetch,
    apiFetchResponse,
} from "@/lib/api";

import type {
    GetAdminUsersParams,
    PaginatedAdminUsers,
} from "@/types/admin-user";

import type { UserRole } from "@/types/auth";

export async function getAdminUsers(
    params?: GetAdminUsersParams,
): Promise<PaginatedAdminUsers> {
    const searchParams =
        new URLSearchParams();

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

    if (params?.role) {
        searchParams.set(
            "role",
            params.role,
        );
    }

    if (params?.isActive !== undefined) {
        searchParams.set(
            "isActive",
            String(params.isActive),
        );
    }

    if (params?.search) {
        searchParams.set(
            "search",
            params.search,
        );
    }

    const queryString =
        searchParams.toString();

    const endpoint = queryString
        ? `${endpoints.admin.users}?${queryString}`
        : endpoints.admin.users;

    const response =
        await apiFetchResponse<
            PaginatedAdminUsers["data"],
            PaginatedAdminUsers["meta"]
        >(endpoint);

    if (!response.meta) {
        throw new Error(
            "User pagination metadata is missing.",
        );
    }

    return {
        data: response.data,
        meta: response.meta,
    };
}

export async function updateUserStatus(
    userId: string,
    isActive: boolean,
): Promise<unknown> {
    return apiFetch(
        endpoints.admin.userStatus(userId),
        {
            method: "PATCH",
            body: JSON.stringify({
                isActive,
            }),
        },
    );
}

export async function updateUserRole(
    userId: string,
    role: Extract<
        UserRole,
        "CUSTOMER" | "TECHNICIAN"
    >,
): Promise<unknown> {
    return apiFetch(
        endpoints.admin.userRole(userId),
        {
            method: "PATCH",
            body: JSON.stringify({
                role,
            }),
        },
    );
}