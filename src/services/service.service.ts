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

export interface UploadedServiceImage {
  imageUrl: string;
  imagePublicId: string;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  basePrice?: number;
  isActive?: boolean;
  imageUrl?: string | null;
  imagePublicId?: string | null;
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

    query.set("sortBy", params?.sortBy ?? "createdAt");
    query.set("sortOrder", params?.sortOrder ?? "desc");
    query.set("page", String(params?.page ?? 1));
    query.set("limit", String(params?.limit ?? 10));

    return apiFetch<PaginatedData<Service>>(
      `${endpoints.services.list}?${query.toString()}`,
    );
  },

  detail(id: string) {
    return apiFetch<Service>(endpoints.services.detail(id));
  },

  // Goes through the Next.js proxy (/api/backend) so the auth cookie is
  // converted to a Bearer token. apiFetch can't be used here because it
  // forces Content-Type: application/json; the browser must set the
  // multipart boundary itself.
  async uploadImage(file: File): Promise<UploadedServiceImage> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `/api/backend/${endpoints.services.uploadImage}`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    const text = await response.text();

    let payload: {
      success?: boolean;
      message?: string;
      data?: UploadedServiceImage;
    } | null = null;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok || payload?.success === false || !payload?.data) {
      throw new Error(
        payload?.message || "Image upload failed. Please try again.",
      );
    }

    return payload.data;
  },

  create(payload: CreateServicePayload) {
    return apiFetch<Service>(endpoints.services.list, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: UpdateServicePayload) {
    return apiFetch<Service>(endpoints.services.detail(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  remove(id: string) {
    return apiFetch<Service>(endpoints.services.detail(id), {
      method: "DELETE",
    });
  },
};