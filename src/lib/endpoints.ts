export const endpoints = {
    auth: {
        register: "auth/register",
        login: "auth/login",
        google: "auth/google",
        refresh: "auth/refresh-token",
        logout: "auth/logout",
        me: "auth/me",
    },

    customers: {
        me: "customers/me",
    },

    addresses: {
        list: "addresses",
        create: "addresses",
        detail: (id: string) => `addresses/${id}`,
        update: (id: string) => `addresses/${id}`,
        delete: (id: string) => `addresses/${id}`,
    },

    services: {
        list: "services",
        detail: (id: string) => `services/${id}`,
    },

    requests: {
        list: "service-requests",
        detail: (id: string) => `service-requests/${id}`,
        create: "service-requests",
        cancel: (id: string) => `service-requests/${id}/cancel`,
    },

    workOrders: {
        /**
         * ADMIN
         */
        list: "work-orders",

        /**
         * CUSTOMER
         */
        customerList: "work-orders/customers/me",

        /**
         * TECHNICIAN
         */
        technicianList: "work-orders/technicians/me",

        detail: (id: string) => `work-orders/${id}`,

        status: (id: string) =>
            `work-orders/${id}/status`,

        schedule: (id: string) =>
            `work-orders/${id}/schedule`,
    },

    technicians: {
        list: "technicians",
        profile: "technicians/technician-profile/me",
        updateProfile: "technicians/me",
        byId: (id: string) => `technicians/${id}`,
        status: (id: string) =>
            `technicians/${id}/status`,
    },

    availability: {
        me: "availabilities/technicians/me",

        create: "availabilities",

        update: (availabilityId: string) =>
            `availabilities/${availabilityId}/technicians/me`,

        delete: (availabilityId: string) =>
            `availabilities/${availabilityId}/technicians/me`,
    },

    assignments: {
        byWorkOrder: (workOrderId: string) =>
            `assignments/work-orders/${workOrderId}`,

        create: (workOrderId: string) =>
            `assignments/work-orders/${workOrderId}`,

        remove: (
            assignmentId: string,
            workOrderId: string,
        ) =>
            `assignments/${assignmentId}/work-orders/${workOrderId}`,
    },

    invoices: {
        customerList: "invoices/customers/me",

        adminList: "invoices",

        detail: (id: string) =>
            `invoices/${id}`,

        createForWorkOrder: (workOrderId: string) =>
            `invoices/work-orders/${workOrderId}`,

        update: (id: string) =>
            `invoices/admin/${id}`,
    },

    payments: {
        myPayments: "payments/me",

        initiate: (invoiceId: string) =>
            `payments/invoices/${invoiceId}`,

        adminList: "admin/payments",
    },

    notifications: {
        list: "notifications",

        markAsRead: (id: string) =>
            `notifications/${id}/read`,

        markAllAsRead: "notifications/read-all",

        create: "notifications",
    },

    admin: {
        dashboard: "admin/dashboard",

        users: "admin/users",

        userStatus: (userId: string) =>
            `admin/users/${userId}/status`,

        userRole: (userId: string) =>
            `admin/users/${userId}/role`,

        technicians: "admin/technicians",

        technicianStatus: (technicianId: string) =>
            `admin/technicians/${technicianId}/status`,

        payments: "admin/payments",

        auditLogs: "admin/audit-logs",
    },
};