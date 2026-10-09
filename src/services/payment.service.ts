import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";
import type { CreatePaymentResponse } from "@/types/payment";

export const paymentService = {
    async initiatePayment(
        invoiceId: string,
    ): Promise<CreatePaymentResponse> {
        return apiFetch<CreatePaymentResponse>(
            endpoints.payments.initiate(invoiceId),
            {
                method: "POST",
                body: JSON.stringify({
                    provider: "BKASH",
                }),
            },
        );
    },
};