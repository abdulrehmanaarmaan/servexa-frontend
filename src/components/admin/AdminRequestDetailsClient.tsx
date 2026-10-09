"use client";

import { useState } from "react";

import Link from "next/link";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  UserRound,
  XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

import type {
  ServiceRequest,
  ServiceRequestStatus,
} from "@/types/request";

const getServiceRequest = async (
  requestId: string,
): Promise<ServiceRequest> => {
  return apiFetch<ServiceRequest>(
    `service-requests/${requestId}`,
  );
};

interface CreateWorkOrderPayload {
  description?: string;
}

interface CreatedWorkOrder {
  id: string;
}

const createWorkOrder = async (
  serviceRequestId: string,
  payload: CreateWorkOrderPayload,
): Promise<CreatedWorkOrder> => {
  return apiFetch<CreatedWorkOrder>(
    `work-orders/service-requests/${serviceRequestId}`,
    {
      method: "POST",
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

const getStatusClassName = (
  status: ServiceRequestStatus,
) => {
  switch (status) {
    case "APPROVED":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 backdrop-blur-md";

    case "CONVERTED":
      return "border-teal-400/30 bg-teal-400/10 text-teal-300 backdrop-blur-md";

    case "REJECTED":
    case "CANCELLED":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300 backdrop-blur-md";

    case "REVIEWED":
      return "border-blue-400/30 bg-blue-400/10 text-blue-300 backdrop-blur-md";

    default:
      return "border-amber-400/30 bg-amber-400/10 text-amber-300 backdrop-blur-md";
  }
};

export default function AdminRequestDetailsClient({
  requestId,
}: {
  requestId: string;
}) {
  const queryClient = useQueryClient();

  const [description, setDescription] = useState("");

  const requestQuery = useQuery({
    queryKey: ["admin-service-request", requestId],
    queryFn: () => getServiceRequest(requestId),
    enabled: Boolean(requestId),
  });

  const createWorkOrderMutation = useMutation({
    mutationFn: () =>
      createWorkOrder(requestId, {
        description: description.trim() || undefined,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-service-request", requestId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-service-requests"],
      });

      setDescription("");
    },
  });

  const request = requestQuery.data;

  const hasWorkOrder = Boolean(request?.workOrder);

  const canCreateWorkOrder =
    request?.status === "APPROVED" && !hasWorkOrder;

  const handleCreateWorkOrder = () => {
    if (!canCreateWorkOrder) {
      return;
    }

    createWorkOrderMutation.mutate();
  };

  if (requestQuery.isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48 bg-slate-800/80" />

          <Skeleton className="h-9 w-24 bg-slate-800/80" />
        </div>

        <Card className="border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="space-y-6 p-4 sm:p-6">
            <Skeleton className="h-8 w-72 bg-slate-800/80" />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["one", "two", "three", "four"].map((id) => (
                <Skeleton
                  key={`request-detail-skeleton-${id}`}
                  className="h-20 bg-slate-800/80"
                />
              ))}
            </div>

            <Skeleton className="h-32 w-full bg-slate-800/80" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requestQuery.isError || !request) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
        <Link
          href="/dashboard/admin/requests"
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "h-10 border-white/10 bg-slate-900/80 text-slate-200 backdrop-blur-md hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:h-9"
          )}
        >
          <ArrowLeft className="mr-2 size-4 text-teal-400" />
          Back to Requests
        </Link>

        <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-200 backdrop-blur-xl shadow-xl">
          <AlertCircle className="size-4 text-rose-400" />

          <AlertTitle className="font-bold text-white">
            Unable to load service request
          </AlertTitle>

          <AlertDescription className="text-xs text-rose-200/90 sm:text-sm">
            {requestQuery.error instanceof Error
              ? requestQuery.error.message
              : "The service request could not be loaded."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            href="/dashboard/admin/requests"
            className="mb-3 inline-flex items-center text-xs font-semibold text-slate-400 transition-colors hover:text-teal-400 sm:text-sm"
          >
            <ArrowLeft className="mr-2 size-4 text-teal-400" />
            Back to Requests
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Service Request
            </h1>

            <Badge
              variant="outline"
              className={cn(
                "rounded-md px-2.5 py-0.5 text-xs font-semibold",
                getStatusClassName(request.status)
              )}
            >
              {statusLabels[request.status]}
            </Badge>
          </div>

          <p className="mt-1 break-all font-mono text-xs text-slate-500">
            Request #{request.id}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => requestQuery.refetch()}
          disabled={requestQuery.isFetching}
          className="h-10 w-full border-white/10 bg-slate-900/80 text-slate-200 shadow-sm backdrop-blur-md hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:h-9 sm:w-auto"
        >
          <RefreshCw
            className={cn(
              "mr-2 size-4 text-teal-400",
              requestQuery.isFetching && "animate-spin"
            )}
          />
          Refresh
        </Button>
      </div>

      {/* Main request information */}
      <Card className="overflow-hidden border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <CardTitle className="text-lg font-bold text-white sm:text-2xl">
                {request.service?.name ?? "Service Request"}
              </CardTitle>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Review the customer request before creating a work order.
              </p>
            </div>

            {request.service?.basePrice !== undefined && (
              <p className="shrink-0 text-xl font-black text-teal-400 sm:text-2xl">
                ৳
                {Number(
                  request.service.basePrice
                ).toLocaleString("en-BD")}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4 sm:p-6">
          {/* Information grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Customer */}
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 size-4 shrink-0 text-teal-400" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                    Customer
                  </p>

                  <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                    {request.customer?.name ?? "Not available"}
                  </p>

                  {request.customer?.user?.email && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {request.customer.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                    Location
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-slate-200 sm:text-sm">
                    {request.address?.addressLine ?? "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Requested date */}
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-teal-400" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                    Requested
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-slate-200 sm:text-sm">
                    {new Date(
                      request.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Work order */}
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-teal-400" />

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                    Work Order
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-slate-200 sm:text-sm">
                    {hasWorkOrder ? "Already created" : "Not created"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {request.description && (
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md sm:p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="size-4 text-teal-400" />

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                  Customer Description
                </p>
              </div>

              <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300 sm:text-sm">
                {request.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing work order */}
      {hasWorkOrder && (
        <Card className="border-emerald-400/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 ring-1 ring-emerald-400/20 shadow-inner">
                  <CheckCircle2 className="size-5 text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Work order already exists
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                    This service request has already been converted into a work order.
                  </p>

                  {request.workOrder?.id && (
                    <p className="mt-2 break-all font-mono text-xs text-slate-500">
                      Work Order #{request.workOrder.id}
                    </p>
                  )}
                </div>
              </div>

              {request.workOrder?.id && (
                <Link
                  href={`/dashboard/admin/work-orders/${request.workOrder.id}`}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "h-10 w-full border-white/10 bg-slate-800 text-slate-200 transition-all hover:bg-slate-700 hover:text-white active:scale-[0.98] sm:h-9 sm:w-auto"
                  )}
                >
                  View Work Order
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create work order */}
      {canCreateWorkOrder && (
        <Card className="border-teal-400/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 ring-1 ring-teal-400/20 shadow-inner">
                <BriefcaseBusiness className="size-5 text-teal-400" />
              </div>

              <div>
                <CardTitle className="text-base font-bold text-white sm:text-lg">
                  Create Work Order
                </CardTitle>

                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  This will create a work order from the approved service request.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="work-order-description"
                className="mb-1.5 block text-xs font-medium text-slate-200 sm:text-sm"
              >
                Work order description
                <span className="ml-1 text-xs font-normal text-slate-500">
                  optional
                </span>
              </label>

              <Textarea
                id="work-order-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                maxLength={2000}
                placeholder="Add any operational notes or instructions for this work order..."
                className="min-h-28 border-white/10 bg-slate-950/80 text-xs text-slate-100 placeholder:text-slate-500 focus:border-teal-400/70 focus:ring-2 focus:ring-teal-400/20 sm:text-sm"
              />

              <p className="mt-1 text-right text-[11px] text-slate-500">
                {description.length}/2000
              </p>
            </div>

            {createWorkOrderMutation.isError && (
              <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-200 backdrop-blur-md">
                <AlertCircle className="size-4 text-rose-400" />

                <AlertTitle className="font-bold text-white">
                  Unable to create work order
                </AlertTitle>

                <AlertDescription className="text-xs text-rose-200/90 sm:text-sm">
                  {createWorkOrderMutation.error instanceof Error
                    ? createWorkOrderMutation.error.message
                    : "Something went wrong while creating the work order."}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                onClick={handleCreateWorkOrder}
                disabled={
                  createWorkOrderMutation.isPending
                }
                className="h-10 w-full bg-teal-400 font-semibold text-slate-950 shadow-md shadow-teal-500/10 hover:bg-teal-300 active:scale-[0.98] sm:h-9 sm:w-auto"
              >
                {createWorkOrderMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating Work Order...
                  </>
                ) : (
                  <>
                    <BriefcaseBusiness className="mr-2 size-4" />
                    Create Work Order
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request isn't ready for work order */}
      {!hasWorkOrder &&
        request.status !== "APPROVED" && (
          <Card className="border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 ring-1 ring-amber-400/20 shadow-inner">
                  <Clock3 className="size-5 text-amber-400" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Work order cannot be created yet
                  </h2>

                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    This request must be in the{" "}
                    <span className="font-semibold text-slate-200">
                      Approved
                    </span>{" "}
                    status before an admin creates a work order.
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Current status:{" "}
                    <span className="text-slate-300">{statusLabels[request.status]}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}