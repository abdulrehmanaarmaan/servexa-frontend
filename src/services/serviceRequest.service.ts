import { apiFetch } from "@/lib/api";
import type {
  ServiceRequest,
  ServiceRequestStatus,
} from "@/types/request";

export interface GetMyServiceRequestsParams {
  search?: string;
  status?: ServiceRequestStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedServiceRequests {
  data: ServiceRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getMyServiceRequests(
  params?: GetMyServiceRequestsParams
): Promise<PaginatedServiceRequests> {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();

  return apiFetch<PaginatedServiceRequests>(
    `service-requests/customers/me${
      queryString ? `?${queryString}` : ""
    }`
  );
}

export async function cancelServiceRequest(
  requestId: string
): Promise<ServiceRequest> {
  return apiFetch<ServiceRequest>(
    `service-requests/${requestId}/cancel`,
    {
      method: "POST",
    }
  );
}