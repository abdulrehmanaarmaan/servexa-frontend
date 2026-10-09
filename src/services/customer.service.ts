import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";
import type { CustomerProfile } from "@/types/customer";

export interface UpdateCustomerPayload {
    name?: string;
    phone?: string;
    company?: string;
}

export async function getMyCustomerProfile() {
    return apiFetch<CustomerProfile>(
        endpoints.customers.me,
    );
}

export async function updateMyCustomerProfile(
    payload: UpdateCustomerPayload,
) {
    return apiFetch<CustomerProfile>(
        endpoints.customers.me,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        },
    );
}