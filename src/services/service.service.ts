import { apiFetch } from "@/lib/api";

import type { PaginatedData } from "@/types/api";
import type { Service } from "@/types/service";

import { endpoints } from "@/lib/endpoints";

export interface ServiceListParams {
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "basePrice" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  basePrice: number;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  basePrice?: number;
  isActive?: boolean;
}

export const serviceService = {
  list(params?: ServiceListParams) {
    const query = new URLSearchParams();

    if (params?.search?.trim()) {
      query.set("search", params.search.trim());
    }

    if (params?.isActive !== undefined) {
      query.set("isActive", String(params.isActive));
    }

    query.set(
      "sortBy",
      params?.sortBy ?? "createdAt",
    );

    query.set(
      "sortOrder",
      params?.sortOrder ?? "desc",
    );

    query.set(
      "page",
      String(params?.page ?? 1),
    );

    query.set(
      "limit",
      String(params?.limit ?? 10),
    );

    return apiFetch<PaginatedData<Service>>(
      `${endpoints.services.list}?${query.toString()}`,
    );
  },

  detail(id: string) {
    return apiFetch<Service>(
      endpoints.services.detail(id),
    );
  },

  create(payload: CreateServicePayload) {
    return apiFetch<Service>(
      endpoints.services.list,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  update(
    id: string,
    payload: UpdateServicePayload,
  ) {
    return apiFetch<Service>(
      endpoints.services.detail(id),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },

  remove(id: string) {
    return apiFetch<Service>(
      endpoints.services.detail(id),
      {
        method: "DELETE",
      },
    );
  },
};