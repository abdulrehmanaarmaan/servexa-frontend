import type { UserRole } from "@/types/auth";

export interface Technician {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}

export interface TechnicianProfile {
    id: string;
    userId: string;
    name: string;
    phone: string | null;
    employeeCode: string | null;
    isActive: boolean;
    user: Technician;
    createdAt: string;
    updatedAt: string;
}