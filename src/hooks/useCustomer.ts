"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getMyCustomerProfile,
    updateMyCustomerProfile,
    type UpdateCustomerPayload,
} from "@/services/customer.service";

export const customerKeys = {
    all: ["customer"] as const,
    profile: () => [...customerKeys.all, "profile"] as const,
};

export function useCustomerProfile() {
    return useQuery({
        queryKey: customerKeys.profile(),
        queryFn: getMyCustomerProfile,
    });
}

export function useUpdateCustomerProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCustomerPayload) =>
            updateMyCustomerProfile(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customerKeys.profile(),
            });
        },
    });
}