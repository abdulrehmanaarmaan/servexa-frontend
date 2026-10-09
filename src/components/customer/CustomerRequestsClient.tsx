"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Inbox,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ServiceRequest, ServiceRequestStatus } from "@/types/request";
import { cn } from "@/lib/utils";
import {
  cancelServiceRequest,
  getMyServiceRequests,
} from "@/services/serviceRequest.service";

const PAGE_SIZE = 10;

const getStatusVariant = (status: ServiceRequestStatus) => {
  switch (status) {
    case "REJECTED":
    case "CANCELLED":
      return "destructive";

    case "APPROVED":
      return "secondary";

    default:
      return "outline";
  }
};

export default function CustomerRequestsClient() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<ServiceRequestStatus | "ALL">("ALL");

  const [page, setPage] = useState(1);

  const [requestToCancel, setRequestToCancel] = useState<ServiceRequest | null>(
    null,
  );

  const requestsQuery = useQuery({
    queryKey: [
      "customer-service-requests",
      {
        search,
        status,
        page,
        limit: PAGE_SIZE,
      },
    ],
    queryFn: () =>
      getMyServiceRequests({
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (previousData) => previousData,
  });

  const cancelMutation = useMutation({
    mutationFn: (requestId: string) => cancelServiceRequest(requestId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-service-requests"],
      });

      setRequestToCancel(null);
    },
  });

  const requests = requestsQuery.data?.data ?? [];

  const totalPages = requestsQuery.data?.meta?.totalPages ?? 1;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: ServiceRequestStatus | "ALL" | null) => {
    if (value === null) {
      return;
    }

    setStatus(value);
    setPage(1);
  };

  const canCancel = (request: ServiceRequest) => {
    return request.status === "PENDING";
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Service Requests
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track the service requests you have submitted to Servexa.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Button
            variant="outline"
            onClick={() => requestsQuery?.refetch()}
            disabled={requestsQuery?.isFetching}
            className="h-10 border-border bg-card hover:bg-accent sm:h-9"
          >
            <RefreshCw
              className={`mr-2 size-4 text-primary ${
                requestsQuery?.isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Link
            href="/dashboard/customer/requests/new"
            className={cn(
              buttonVariants(),
              "h-10 bg-primary font-semibold text-primary-foreground hover:bg-primary/90 sm:h-9",
            )}
          >
            <Plus className="mr-1.5 size-4" />
            New Request
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Search and filter
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={handleSearch}
                placeholder="Search requests..."
                className="h-10 w-full rounded-xl border-white/10 bg-slate-950 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/70 focus:ring-2 focus:ring-teal-400/20 sm:h-9"
              />
            </div>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950 text-sm text-slate-100 focus:border-teal-400/70 focus:ring-2 focus:ring-teal-400/20 sm:h-9">
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
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {requestsQuery?.isError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>Unable to load service requests</AlertTitle>

          <AlertDescription>
            {requestsQuery.error instanceof Error
              ? requestsQuery.error.message
              : "Something went wrong while loading your requests."}
          </AlertDescription>
        </Alert>
      )}

      {/* Requests */}
      {/* List Container */}
      <div className="space-y-4">
        {requestsQuery?.isPending ? (
          ["one", "two", "three"].map((id) => (
            <Card
              key={`request-skeleton-${id}`}
              className="border-white/10 bg-slate-900"
            >
              <CardContent className="space-y-5 p-4 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-6 w-48 bg-slate-800" />
                  <Skeleton className="h-6 w-24 bg-slate-800" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Skeleton className="h-12 bg-slate-800" />
                  <Skeleton className="h-12 bg-slate-800" />
                  <Skeleton className="h-12 bg-slate-800" />
                </div>

                <Skeleton className="h-9 w-full bg-slate-800 sm:w-32" />
              </CardContent>
            </Card>
          ))
        ) : requests.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 sm:size-16">
                <Inbox className="size-7 text-teal-400 sm:size-8" />
              </div>

              <h2 className="text-base font-bold text-white sm:text-xl">
                No service requests found
              </h2>

              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
                You have not submitted any matching service requests yet.
              </p>

              <Link
                href="/dashboard/customer/requests/new"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-6 h-10 w-full bg-teal-400 font-semibold text-slate-950 hover:bg-teal-300 sm:h-9 sm:w-auto",
                )}
              >
                <Plus className="mr-1.5 size-4" />
                Create a Request
              </Link>
            </CardContent>
          </Card>
        ) : (
          requests.map((request: any) => (
            <Card
              key={request.id}
              className="overflow-hidden border-white/10 bg-slate-900 transition-colors hover:border-teal-400/25"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-5">
                  {/* Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-white sm:text-lg">
                          {request.service?.name ?? "Service Request"}
                        </h2>

                        <Badge
                          variant={
                            getStatusVariant
                              ? getStatusVariant(request.status)
                              : "outline"
                          }
                          className="rounded-md px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        Request #{request.id}
                      </p>
                    </div>

                    {request.service?.basePrice !== undefined && (
                      <p className="shrink-0 text-base font-bold text-teal-400 sm:text-xl">
                        ৳{Number(request.service.basePrice).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Operational Details */}
                  <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-950 p-3.5 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-teal-400" />

                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                          Requested
                        </p>

                        <p className="mt-0.5 truncate text-sm font-semibold text-slate-200">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2.5">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />

                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                          Service location
                        </p>

                        <p className="mt-0.5 truncate break-all text-sm font-semibold text-slate-200">
                          {request.address?.addressLine || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2 lg:col-span-1">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-teal-400" />

                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                          Scheduled time
                        </p>

                        <p className="mt-0.5 truncate text-sm font-semibold text-slate-200">
                          {request.scheduledAt
                            ? new Date(request.scheduledAt).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {request.description && (
                    <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3.5 sm:p-4">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
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
                      href={`/dashboard/customer/requests/${request.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-10 w-full border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white sm:h-9 sm:w-auto",
                      )}
                    >
                      <Eye className="mr-2 size-4 text-teal-400" />
                      View Details
                    </Link>

                    {canCancel?.(request) && (
                      <Button
                        variant="destructive"
                        onClick={() => setRequestToCancel(request)}
                        className="h-10 w-full border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 sm:h-9 sm:w-auto"
                      >
                        <XCircle className="mr-2 size-4" />
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          Page {page} of {totalPages}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || requestsQuery?.isFetching}
            onClick={() =>
              setPage((current: number) => Math.max(1, current - 1))
            }
            className="h-9"
          >
            <ChevronLeft className="mr-1 size-4 text-primary" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || requestsQuery?.isFetching}
            onClick={() =>
              setPage((current: number) => Math.min(totalPages, current + 1))
            }
            className="h-9"
          >
            Next
            <ChevronRight className="ml-1 size-4 text-primary" />
          </Button>
        </div>
      </div>

      {/* Cancel dialog */}
      <AlertDialog
        open={Boolean(requestToCancel)}
        onOpenChange={(open) => {
          if (!open && !cancelMutation?.isPending) {
            setRequestToCancel(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel service request?</AlertDialogTitle>

            <AlertDialogDescription>
              This will cancel the selected service request. This action should
              only be available while the request is still eligible for
              cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <AlertDialogCancel
              disabled={cancelMutation?.isPending}
              className="mt-0"
            >
              Keep Request
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();

                if (requestToCancel) {
                  cancelMutation.mutate(requestToCancel.id);
                }
              }}
              disabled={cancelMutation?.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {cancelMutation?.isPending && (
                <RefreshCw className="mr-2 size-4 animate-spin" />
              )}
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
