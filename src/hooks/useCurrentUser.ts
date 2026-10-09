"use client";

import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";

export const authKeys = {
    all: ["auth"] as const,
    currentUser: () =>
        [...authKeys.all, "current-user"] as const,
};

export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: authService.me,
        staleTime: 60_000,
    });
}