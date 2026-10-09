export type UserRole =
    | "CUSTOMER"
    | "TECHNICIAN"
    | "ADMIN";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "TECHNICIAN";
    phone?: string;
}

export interface AuthData {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
}