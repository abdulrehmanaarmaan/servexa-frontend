"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminTechnician } from "@/types/dashboard";
import { getAdminTechnicians } from "@/services/admin.service";

export function useAdminTechnicians(
  initialData?: AdminTechnician[],
) {
  return useQuery({
    queryKey: ["admin-technicians"],
    queryFn: getAdminTechnicians,
    initialData,
  });
}