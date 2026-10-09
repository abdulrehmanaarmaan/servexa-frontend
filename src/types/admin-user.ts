import type { UserRole } from "@/types/auth";

export interface AdminUser {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdminUsersMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedAdminUsers {
    data: AdminUser[];
    meta: AdminUsersMeta;
}

export interface GetAdminUsersParams {
    search?: string;
    role?: UserRole;
    isActive?: boolean;
    page?: number;
    limit?: number;
}