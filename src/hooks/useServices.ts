"use client";

import { useQuery } from "@tanstack/react-query";

import {
  serviceService,
  type ServiceListParams,
} from "@/services/service.service";

export function useServices(
  params: ServiceListParams = {},
) {
  return useQuery({
    queryKey: [
      "services",
      params.search ?? "",
      params.isActive ?? true,
      params.sortBy ?? "createdAt",
      params.sortOrder ?? "desc",
      params.page ?? 1,
      params.limit ?? 10,
    ],

    queryFn: () =>
      serviceService.list({
        ...params,
        isActive: params.isActive ?? true,
      }),

    // Keep showing the previous results while a new search loads
    placeholderData: (previousData) => previousData,
  });
}