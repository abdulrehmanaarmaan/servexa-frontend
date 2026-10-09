export type PaymentProvider =
    | "BKASH"
    | "STRIPE";

export type PaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

export interface InvoiceWorkOrderService {
    id: string;
    name: string;
    basePrice?: number | string | null;
}

export interface InvoiceWorkOrder {
    id: string;
    serviceId: string;
    service?: InvoiceWorkOrderService | null;
}

export interface InvoicePayment {
    id: string;
    amount: number | string;
    currency: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    transactionId?: string | null;
    gatewayReference?: string | null;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Invoice {
    id: string;
    workOrderId: string;
    invoiceNumber: string;

    subtotal: number | string;
    tax: number | string;
    total: number | string;

    status: InvoiceStatus;

    issuedAt: string;
    dueAt?: string | null;

    createdAt: string;
    updatedAt: string;

    workOrder?: InvoiceWorkOrder | null;
    payments?: InvoicePayment[];
}

export interface InvoicePaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AdminInvoicesResponse {
    data: Invoice[];
    meta: InvoicePaginationMeta;
}

export type InvoiceStatus =
    | "ISSUED"
    | "PAID"
    | "PARTIALLY_PAID"
    | "OVERDUE"
    | "VOID";

export interface InvoiceQueryParams {
    page?: number;
    limit?: number;
    status?: InvoiceStatus;
    sortBy?:
        | "createdAt"
        | "issuedAt"
        | "dueAt"
        | "total";
    sortOrder?: "asc" | "desc";
}

export interface CreateInvoicePayload {
    subtotal: number;
    tax: number;
    dueAt?: string;
}

export interface UpdateInvoicePayload {
    tax?: number;
    dueAt?: string | null;
}