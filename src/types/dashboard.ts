export interface AdminDashboard {
    users: {
        total: number;
    };

    customers: {
        total: number;
    };

    technicians: {
        total: number;
        active: number;
    };

    serviceRequests: {
        pending: number;
    };

    workOrders: {
        active: number;
        completed: number;
    };

    invoices: {
        issued: number;
        paid: number;
    };

    payments: {
        pending: number;
        paid: number;
    };
}

export interface WorkOrder {
    id: string;
    title?: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Address {
    id: string;
    label?: string;
    address?: string;
    city?: string;
    area?: string;
    postalCode?: string;
    createdAt?: string;
}

export interface Notification {
    id: string;
    title?: string;
    message?: string;
    type?: string;
    isRead?: boolean;
    read?: boolean;
    createdAt: string;
}

export interface AdminTechnicianUser {
    id: string;
    email: string;
    isActive: boolean;
}

export interface AdminTechnician {
    id: string;
    userId: string;
    name: string;
    phone: string | null;
    employeeCode: string | null;
    isActive: boolean;
    user: AdminTechnicianUser;
    createdAt: string;
    updatedAt: string;
}

export interface AuditLog {
    id: string;
    actorId: string | null;
    action: string;
    entity: string;
    entityId: string;
    oldValue?: unknown;
    newValue?: unknown;
    createdAt: string;
}

export interface AuditLogMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AdminAuditLogsResponse {
    data: AuditLog[];
    meta: AuditLogMeta;
}