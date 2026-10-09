"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Inbox,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { apiFetch, apiFetchResponse } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";

import type { ServicePriority, ServiceRequest, ServiceRequestStatus } from "@/types/request";

const PAGE_SIZE = 10;

type SortBy = "createdAt" | "updatedAt" | "priority";
type SortOrder = "asc" | "desc";

interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminServiceRequestsResponse {
  data: ServiceRequest[];
  meta: PageMeta;
}

interface GetAdminServiceRequestsParams {
  page?: number;
  limit?: number;
  status?: ServiceRequestStatus;
  priority?: ServicePriority;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

interface UpdateServiceRequestStatusPayload {
  status: ServiceRequestStatus;
  reason?: string;
}

/**
 * The backend returns { success, data: [...], meta } at the top level,
 * so apiFetchResponse is used to keep `meta`. It goes through /api/backend,
 * which forwards the auth cookie to the backend.
 */
const getAdminServiceRequests = async (
  params: GetAdminServiceRequestsParams = {},
): Promise<AdminServiceRequestsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.priority) searchParams.set("priority", params.priority);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await apiFetchResponse<ServiceRequest[], PageMeta>(
    `${endpoints.requests.list}?${searchParams.toString()}`,
  );

  const data = response.data ?? [];

  return {
    data,
    meta: response.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? PAGE_SIZE,
      total: data.length,
      totalPages: 1,
    },
  };
};

const updateAdminServiceRequestStatus = async (
  serviceRequestId: string,
  payload: UpdateServiceRequestStatusPayload,
): Promise<ServiceRequest> => {
  return apiFetch<ServiceRequest>(
    `${endpoints.requests.detail(serviceRequestId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
};

const statusLabels: Record<ServiceRequestStatus, string> = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CONVERTED: "Converted",
  CANCELLED: "Cancelled",
};

const priorityLabels: Record<ServicePriority, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

const getStatusVariant = (status: ServiceRequestStatus) => {
  switch (status) {
    case "REJECTED":
    case "CANCELLED":
      return "destructive" as const;

    case "APPROVED":
    case "CONVERTED":
      return "secondary" as const;

    default:
      return "outline" as const;
  }
};

const getPriorityClass = (priority: ServicePriority) => {
  switch (priority) {
    case "URGENT":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";

    case "HIGH":
      return "border-orange-400/20 bg-orange-400/10 text-orange-300";

    case "LOW":
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";

    default:
      return "border-teal-400/20 bg-teal-400/10 text-teal-300";
  }
};

// Must match the backend's allowedTransitions in service-request.service.ts
const getAvailableStatuses = (
  status: ServiceRequestStatus,
): ServiceRequestStatus[] => {
  switch (status) {
    case "PENDING":
      return ["REVIEWED", "APPROVED", "REJECTED", "CANCELLED"];

    case "REVIEWED":
      return ["APPROVED", "REJECTED", "CANCELLED"];

    case "APPROVED":
      return ["CONVERTED", "CANCELLED"];

    default:
      return [];
  }
};

export default function AdminRequestsClient() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServiceRequestStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<ServicePriority | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);

  const [requestForReview, setRequestForReview] =
    useState<ServiceRequest | null>(null);
  const [nextStatus, setNextStatus] = useState<ServiceRequestStatus | "">("");
  const [reason, setReason] = useState("");

  const requestsQuery = useQuery({
    queryKey: [
      "admin-service-requests",
      {
        status,
        priority,
        sortBy,
        sortOrder,
        page,
        limit: PAGE_SIZE,
      },
    ],

    queryFn: () =>
      getAdminServiceRequests({
        page,
        limit: PAGE_SIZE,
        status: status === "ALL" ? undefined : status,
        priority: priority === "ALL" ? undefined : priority,
        sortBy,
        sortOrder,
      }),

    placeholderData: (previousData) => previousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      requestId,
      status,
      reason,
    }: {
      requestId: string;
      status: ServiceRequestStatus;
      reason?: string;
    }) =>
      updateAdminServiceRequestStatus(requestId, {
        status,
        reason,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-service-requests"],
      });

      setRequestForReview(null);
      setNextStatus("");
      setReason("");
    },
  });

  const requests = requestsQuery.data?.data ?? [];

  // The backend has no search field, so search only filters the current page
  const filteredRequests = search.trim()
    ? requests.filter((request) => {
        const searchValue = search.trim().toLowerCase();

        return (
          request.id.toLowerCase().includes(searchValue) ||
          request.service?.name?.toLowerCase().includes(searchValue) ||
          request.customer?.name?.toLowerCase().includes(searchValue) ||
          request.address?.addressLine?.toLowerCase().includes(searchValue)
        );
      })
    : requests;

  const totalPages = requestsQuery.data?.meta?.totalPages ?? 1;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleStatusChange = (value: ServiceRequestStatus | "ALL" | null) => {
    if (value === null) return;

    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (
    value: ServicePriority | "ALL" | null,
  ) => {
    if (value === null) return;

    setPriority(value);
    setPage(1);
  };

  const handleSortByChange = (value: SortBy | null) => {
    if (value === null) return;

    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: SortOrder | null) => {
    if (value === null) return;

    setSortOrder(value);
    setPage(1);
  };

  const openReviewDialog = (request: ServiceRequest) => {
    statusMutation.reset();
    setRequestForReview(request);
    setNextStatus("");
    setReason("");
  };

  const closeReviewDialog = () => {
    if (statusMutation.isPending) return;

    setRequestForReview(null);
    setNextStatus("");
    setReason("");
  };

  const submitStatusUpdate = () => {
    if (!requestForReview || !nextStatus) return;

    statusMutation.mutate({
      requestId: requestForReview.id,
      status: nextStatus,
      reason: reason.trim() || undefined,
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Service Requests
            </h1>

            <Badge
              variant="outline"
              className="border-teal-400/30 bg-teal-400/10 text-teal-300 backdrop-blur-md"
            >
              Admin
            </Badge>
          </div>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Review, filter, and manage service requests submitted by customers.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => requestsQuery.refetch()}
          disabled={requestsQuery.isFetching}
          className="h-10 w-full border-white/10 bg-slate-900/80 text-slate-200 shadow-sm backdrop-blur-md hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:h-9 sm:w-auto"
        >
          <RefreshCw
            className={cn(
              "mr-2 size-4 text-teal-400",
              requestsQuery.isFetching && "animate-spin",
            )}
          />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
            Search and filter
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search current page..."
                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-teal-400/70 focus:ring-2 focus:ring-teal-400/20 sm:h-9"
              />
            </div>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950/80 text-sm text-slate-100 sm:h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950/80 text-sm text-slate-100 sm:h-9">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950/80 text-sm text-slate-100 sm:h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="createdAt">Created date</SelectItem>
                <SelectItem value="updatedAt">Updated date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleSortOrderChange(sortOrder === "desc" ? "asc" : "desc")
              }
              className="h-8 border-white/10 bg-slate-950/80 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Sort: {sortOrder === "desc" ? "Newest first" : "Oldest first"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {requestsQuery.isError && (
        <Alert
          variant="destructive"
          className="border-rose-500/30 bg-rose-500/10 text-rose-200"
        >
          <AlertCircle className="size-4 text-rose-400" />

          <AlertTitle className="font-semibold text-white">
            Unable to load service requests
          </AlertTitle>

          <AlertDescription className="text-xs text-rose-200/90 sm:text-sm">
            {requestsQuery.error instanceof Error
              ? requestsQuery.error.message
              : "Something went wrong while loading service requests."}
          </AlertDescription>
        </Alert>
      )}

      {/* Request list */}
      <div className="space-y-4">
        {requestsQuery.isPending ? (
          ["one", "two", "three"].map((id) => (
            <Card
              key={`request-skeleton-${id}`}
              className="border-white/10 bg-slate-900/80 backdrop-blur-md"
            >
              <CardContent className="space-y-5 p-4 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-6 w-56 bg-slate-800/80" />
                  <Skeleton className="h-6 w-24 bg-slate-800/80" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Skeleton className="h-12 bg-slate-800/80" />
                  <Skeleton className="h-12 bg-slate-800/80" />
                  <Skeleton className="h-12 bg-slate-800/80" />
                </div>

                <Skeleton className="h-9 w-full bg-slate-800/80 sm:w-32" />
              </CardContent>
            </Card>
          ))
        ) : requestsQuery.isError && !requestsQuery.data ? null : filteredRequests.length ===
          0 ? (
          <Card className="border-dashed border-white/15 bg-slate-900/40 shadow-xl backdrop-blur-xl">
            <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 shadow-inner ring-1 ring-teal-400/20 sm:size-16">
                <Inbox className="size-7 text-teal-400 sm:size-8" />
              </div>

              <h2 className="text-base font-bold text-white sm:text-xl">
                No service requests found
              </h2>

              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
                No service requests match the current search term or filter
                selection.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => {
            const availableStatuses = getAvailableStatuses(request.status);

            return (
              <Card
                key={request.id}
                className="overflow-hidden border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-xl transition-all duration-200 hover:border-teal-400/30"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-white sm:text-lg">
                            {request.service?.name ?? "Service Request"}
                          </h2>

                          <Badge
                            variant={getStatusVariant(request.status)}
                            className="rounded-md px-2.5 py-0.5 text-xs font-semibold"
                          >
                            {statusLabels[request.status]}
                          </Badge>

                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                              getPriorityClass(request.priority),
                            )}
                          >
                            {priorityLabels[request.priority]}
                          </Badge>
                        </div>

                        <p className="mt-1 break-all font-mono text-xs text-slate-500">
                          Request #{request.id}
                        </p>
                      </div>

                      {request.service?.basePrice !== undefined &&
                        request.service?.basePrice !== null && (
                          <p className="shrink-0 text-base font-black text-teal-400 sm:text-xl">
                            ৳
                            {Number(request.service.basePrice).toLocaleString(
                              "en-BD",
                            )}
                          </p>
                        )}
                    </div>

                    {/* Details */}
                    <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <UserRound className="mt-0.5 size-4 shrink-0 text-teal-400" />

                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                            Customer
                          </p>

                          <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                            {request.customer?.name ?? "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5">
                        <CalendarDays className="mt-0.5 size-4 shrink-0 text-teal-400" />

                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                            Requested
                          </p>

                          <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />

                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                            Location
                          </p>

                          <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                            {request.address?.addressLine ?? "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5">
                        <Clock3 className="mt-0.5 size-4 shrink-0 text-teal-400" />

                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                            Work order
                          </p>

                          <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                            {request.workOrder ? "Created" : "Not created"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md sm:p-4">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                          Description
                        </p>

                        <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={`/dashboard/admin/requests/${request.id}`}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                          }),
                          "h-10 w-full border-white/10 bg-slate-800 text-slate-200 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] sm:h-9 sm:w-auto",
                        )}
                      >
                        <Eye className="mr-2 size-4 text-teal-400" />
                        View Details
                      </Link>

                      {availableStatuses.length > 0 && (
                        <Button
                          onClick={() => openReviewDialog(request)}
                          className="h-10 w-full bg-teal-400 font-semibold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-9 sm:w-auto"
                        >
                          <CheckCircle2 className="mr-2 size-4" />
                          Review Request
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center text-xs text-slate-400 sm:text-left sm:text-sm">
          Page <span className="font-bold text-slate-200">{page}</span> of{" "}
          <span className="font-bold text-slate-200">{totalPages}</span>
          {requestsQuery.data?.meta?.total !== undefined && (
            <span className="ml-2 text-slate-500">
              ({requestsQuery.data.meta.total} total)
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || requestsQuery.isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="h-9 border-white/10 bg-slate-900/80 text-slate-200 hover:bg-slate-800 active:scale-[0.98]"
          >
            <ChevronLeft className="mr-1 size-4 text-teal-400" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || requestsQuery.isFetching}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            className="h-9 border-white/10 bg-slate-900/80 text-slate-200 hover:bg-slate-800 active:scale-[0.98]"
          >
            Next
            <ChevronRight className="ml-1 size-4 text-teal-400" />
          </Button>
        </div>
      </div>

      {/* Review dialog */}
      {requestForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-bold text-white sm:text-lg">
                Review service request
              </h2>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Update the request status according to the allowed workflow.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                  Current status
                </p>

                <div className="mt-2">
                  <Badge variant={getStatusVariant(requestForReview.status)}>
                    {statusLabels[requestForReview.status]}
                  </Badge>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-status"
                  className="mb-1.5 block text-xs font-medium text-slate-200 sm:text-sm"
                >
                  New status
                </label>

                <Select
                  value={nextStatus}
                  onValueChange={(value) => {
                    if (value === null) return;

                    setNextStatus(value as ServiceRequestStatus);
                  }}
                >
                  <SelectTrigger
                    id="new-status"
                    className="h-10 w-full border-white/10 bg-slate-950/80 text-sm text-slate-100 sm:h-9"
                  >
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>

                  <SelectContent>
                    {getAvailableStatuses(requestForReview.status).map(
                      (availableStatus) => (
                        <SelectItem
                          key={availableStatus}
                          value={availableStatus}
                        >
                          {statusLabels[availableStatus]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="status-reason"
                  className="mb-1.5 block text-xs font-medium text-slate-200 sm:text-sm"
                >
                  Reason
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    optional
                  </span>
                </label>

                <Textarea
                  id="status-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Add a short reason for this status change..."
                  maxLength={500}
                  className="min-h-24 border-white/10 bg-slate-950/80 text-xs text-slate-100 placeholder:text-slate-500 sm:text-sm"
                />

                <p className="mt-1 text-right text-[11px] text-slate-500">
                  {reason.length}/500
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={closeReviewDialog}
                disabled={statusMutation.isPending}
                className="h-10 border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white active:scale-[0.98] sm:h-9 sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={submitStatusUpdate}
                disabled={!nextStatus || statusMutation.isPending}
                className="h-10 bg-teal-400 font-semibold text-slate-950 hover:bg-teal-300 active:scale-[0.98] sm:h-9 sm:w-auto"
              >
                {statusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Update Status
                  </>
                )}
              </Button>
            </div>

            {statusMutation.isError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-300 sm:text-sm">
                <XCircle className="mt-0.5 size-4 shrink-0 text-rose-400" />

                <p>
                  {statusMutation.error instanceof Error
                    ? statusMutation.error.message
                    : "Unable to update the service request."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}