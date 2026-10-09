import { endpoints } from "@/lib/endpoints";
import {
    apiFetch,
    apiFetchResponse,
} from "@/lib/api";

import type {
    AdminInvoicesResponse,
    CreateInvoicePayload,
    Invoice,
    InvoiceQueryParams,
    UpdateInvoicePayload,
} from "@/types/invoice";

export async function getAdminInvoices(
    params: InvoiceQueryParams = {},
): Promise<AdminInvoicesResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set(
        "page",
        String(params.page ?? 1),
    );

    searchParams.set(
        "limit",
        String(params.limit ?? 10),
    );

    if (params.status) {
        searchParams.set(
            "status",
            params.status,
        );
    }

    if (params.sortBy) {
        searchParams.set(
            "sortBy",
            params.sortBy,
        );
    }

    if (params.sortOrder) {
        searchParams.set(
            "sortOrder",
            params.sortOrder,
        );
    }

    const response = await apiFetchResponse<
        Invoice[],
        AdminInvoicesResponse["meta"]
    >(
        `${endpoints.invoices.adminList}?${searchParams.toString()}`,
    );

    if (!response.meta) {
        throw new Error(
            "Invoice pagination metadata is missing.",
        );
    }

    return {
        data: response.data,
        meta: response.meta,
    };
}

export async function getMyInvoices(
    params: InvoiceQueryParams = {},
): Promise<AdminInvoicesResponse> {
    const searchParams = new URLSearchParams();

    searchParams.set(
        "page",
        String(params.page ?? 1),
    );

    searchParams.set(
        "limit",
        String(params.limit ?? 10),
    );

    if (params.status) {
        searchParams.set(
            "status",
            params.status,
        );
    }

    if (params.sortBy) {
        searchParams.set(
            "sortBy",
            params.sortBy,
        );
    }

    if (params.sortOrder) {
        searchParams.set(
            "sortOrder",
            params.sortOrder,
        );
    }

    const response = await apiFetchResponse<
        Invoice[],
        AdminInvoicesResponse["meta"]
    >(
        `${endpoints.invoices.customerList}?${searchParams.toString()}`,
    );

    if (!response.meta) {
        throw new Error(
            "Invoice pagination metadata is missing.",
        );
    }

    return {
        data: response.data,
        meta: response.meta,
    };
}

export async function getInvoice(
    invoiceId: string,
): Promise<Invoice> {
    return apiFetch<Invoice>(
        endpoints.invoices.detail(invoiceId),
    );
}

export async function createInvoice(
    workOrderId: string,
    payload: CreateInvoicePayload,
): Promise<Invoice> {
    return apiFetch<Invoice>(
        endpoints.invoices.createForWorkOrder(
            workOrderId,
        ),
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );
}

export async function updateInvoice(
    invoiceId: string,
    payload: UpdateInvoicePayload,
): Promise<Invoice> {
    return apiFetch<Invoice>(
        endpoints.invoices.update(invoiceId),
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );
}