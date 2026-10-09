import { InvoiceStatus } from "./invoice";

export type PaymentProvider = "BKASH";

export type PaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

export interface PaymentInvoice {
    id: string;
    total: number | string;
    status: string;
    workOrder: {
        id: string;
        invoiceNumber: string,
        total: number,
        status: InvoiceStatus,
    };
}

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number | string;
    currency: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    transactionId?: string | null;
    gatewayReference?: string | null;
    gatewayResponse?: unknown;
    paidAt?: string | null;
    refundedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    invoice?: PaymentInvoice | null;
}

export interface PaymentInitiation {
    paymentUrl: string;
}

export interface CreatePaymentPayload {
    provider: PaymentProvider;
}

export interface CreatePaymentResponse {
    paymentId: string;
    paymentUrl: string;
}