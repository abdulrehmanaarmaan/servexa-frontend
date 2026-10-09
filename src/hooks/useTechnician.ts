"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    technicianService,
    type UpdateTechnicianProfilePayload,
} from "@/services/technician.service";

export const technicianKeys = {
    all: ["technician"] as const,
    profile: () =>
        [...technicianKeys.all, "profile"] as const,
};

export function useTechnicianProfile() {
    return useQuery({
        queryKey: technicianKeys.profile(),
        queryFn: technicianService.getMyProfile,
    });
}

export function useUpdateTechnicianProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            payload: UpdateTechnicianProfilePayload,
        ) =>
            technicianService.updateMyProfile(
                payload,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: technicianKeys.profile(),
            });

            queryClient.invalidateQueries({
                queryKey: ["current-user"],
            });
        },
    });
}