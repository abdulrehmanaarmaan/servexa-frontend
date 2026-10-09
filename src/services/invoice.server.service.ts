import { endpoints } from "@/lib/endpoints";
import { serverApiFetchResponse } from "@/lib/api-server";

import type {
    AdminInvoicesResponse,
    Invoice,
    InvoiceQueryParams,
} from "@/types/invoice";

export async function getAdminInvoicesServer(
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

    const endpoint =
        `${endpoints.invoices.adminList}?${searchParams.toString()}`;

    const response = await serverApiFetchResponse<
        Invoice[],
        AdminInvoicesResponse["meta"]
    >(endpoint);

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