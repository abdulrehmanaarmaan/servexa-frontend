"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Loader2,
  AlertCircle,
  UserRound,
  Wrench,
} from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { WorkOrder, WorkOrderStatus } from "@/types/work-order";

import { workOrderService } from "@/services/work-order.service";

const PAGE_SIZE = 10;

const statusLabels: Record<WorkOrderStatus, string> = {
  OPEN: "Open",
  SCHEDULED: "Scheduled",
  ASSIGNED: "Assigned",
  EN_ROUTE: "En Route",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusVariant = (status: WorkOrderStatus) => {
  switch (status) {
    case "COMPLETED":
      return "default";

    case "CANCELLED":
      return "destructive";

    case "IN_PROGRESS":
    case "EN_ROUTE":
      return "secondary";

    default:
      return "outline";
  }
};

const nextStatusMap: Partial<Record<WorkOrderStatus, WorkOrderStatus>> = {
  ASSIGNED: "EN_ROUTE",
  EN_ROUTE: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

export default function TechnicianJobsClient() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const statusParam = searchParams.get("status");

  const status: WorkOrderStatus | "ALL" =
    statusParam && statusParam in statusLabels
      ? (statusParam as WorkOrderStatus)
      : "ALL";

  const sortByParam = searchParams.get("sortBy");

  const sortBy: "createdAt" | "scheduledStart" | "updatedAt" =
    sortByParam === "scheduledStart" || sortByParam === "updatedAt"
      ? sortByParam
      : "createdAt";

  const sortOrderParam = searchParams.get("sortOrder");

  const sortOrder: "asc" | "desc" = sortOrderParam === "asc" ? "asc" : "desc";

  const [selectedJob, setSelectedJob] = useState<WorkOrder | null>(null);

  const [completionNote, setCompletionNote] = useState("");

  const updateUrl = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
        return;
      }

      params.set(key, String(value));
    });

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const jobsQuery = useQuery({
    queryKey: [
      "technician-jobs",
      {
        page,
        status,
        sortBy,
        sortOrder,
      },
    ],

    queryFn: () =>
      workOrderService.getMyTechnicianWorkOrders({
        page,
        limit: PAGE_SIZE,
        status: status === "ALL" ? undefined : status,
        sortBy,
        sortOrder,
      }),

    placeholderData: (previousData) => previousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      workOrderId,
      status,
      reason,
    }: {
      workOrderId: string;
      status: WorkOrderStatus;
      reason?: string;
    }) =>
      workOrderService.updateWorkOrderStatus(workOrderId, {
        status,
        reason,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["technician-jobs"],
      });

      setSelectedJob(null);
      setCompletionNote("");
    },
  });

  const jobs = jobsQuery.data?.data ?? [];

  const totalPages = jobsQuery.data?.meta?.totalPages ?? 1;

  // The Select's onValueChange can pass null, so all three handlers accept it
  const handleStatusFilter = (value: string | null) => {
    if (value === null) {
      return;
    }

    updateUrl({
      status: value === "ALL" ? null : value,
      page: 1,
    });
  };

  const handleSortBy = (value: string | null) => {
    if (value === null) {
      return;
    }

    updateUrl({
      sortBy: value,
      page: 1,
    });
  };

  const handleSortOrder = (value: string | null) => {
    if (value === null) {
      return;
    }

    updateUrl({
      sortOrder: value,
      page: 1,
    });
  };

  const handleNextPage = () => {
    if (page >= totalPages) {
      return;
    }

    updateUrl({
      page: page + 1,
    });
  };

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    updateUrl({
      page: page - 1,
    });
  };

  const handleNextStatus = () => {
    if (!selectedJob) {
      return;
    }

    const nextStatus = nextStatusMap[selectedJob.status];

    if (!nextStatus) {
      return;
    }

    statusMutation.mutate({
      workOrderId: selectedJob.id,
      status: nextStatus,
      reason:
        nextStatus === "COMPLETED"
          ? completionNote.trim() || undefined
          : undefined,
    });
  };

  const selectedNextStatus = selectedJob
    ? nextStatusMap[selectedJob.status]
    : undefined;

  const canStartNextStep = Boolean(selectedNextStatus);

  const hasJobs = useMemo(() => jobs.length > 0, [jobs]);

  return (
    <>
      <div className="space-y-6 text-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-400">
              <Wrench className="size-4 sm:size-5" />
              <span className="text-xs font-semibold tracking-wide sm:text-sm">
                Technician Operations
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              My Jobs
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              View your assigned work orders and update job progress.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-white/10 bg-slate-950/40 px-6 py-4">
            <CardTitle className="text-sm font-bold tracking-wide text-white uppercase">
              Filter jobs
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Select value={status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus:ring-1 focus:ring-teal-400">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl">
                  <SelectItem value="ALL">All statuses</SelectItem>

                  <SelectItem value="ASSIGNED">Assigned</SelectItem>

                  <SelectItem value="EN_ROUTE">En Route</SelectItem>

                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>

                  <SelectItem value="ON_HOLD">On Hold</SelectItem>

                  <SelectItem value="COMPLETED">Completed</SelectItem>

                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortBy}>
                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus:ring-1 focus:ring-teal-400">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl">
                  <SelectItem value="createdAt">Created date</SelectItem>

                  <SelectItem value="scheduledStart">Scheduled time</SelectItem>

                  <SelectItem value="updatedAt">Recently updated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={handleSortOrder}>
                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-slate-950/60 text-xs text-slate-200 focus:ring-1 focus:ring-teal-400">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-slate-900 text-slate-200 backdrop-blur-2xl">
                  <SelectItem value="desc">Descending</SelectItem>

                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {jobsQuery.isError && (
          <Alert
            variant="destructive"
            className="rounded-2xl border-red-500/30 bg-red-950/40 text-red-200 backdrop-blur-xl"
          >
            <AlertCircle className="size-4 text-red-400" />

            <AlertTitle className="font-bold">Unable to load jobs</AlertTitle>

            <AlertDescription className="text-xs text-red-300">
              {jobsQuery.error instanceof Error
                ? jobsQuery.error.message
                : "Something went wrong while loading your jobs."}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {jobsQuery.isPending ? (
            ["one", "two", "three", "four"].map((id) => (
              <Card
                key={id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
              >
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-48 bg-white/10" />

                  <Skeleton className="h-4 w-72 bg-white/10" />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-10 bg-white/10" />
                    <Skeleton className="h-10 bg-white/10" />
                    <Skeleton className="h-10 bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !hasJobs ? (
            <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
                  <Wrench className="size-6 text-teal-400" />
                </div>

                <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
                  No jobs found
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
                  Assigned work orders will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => {
              const nextStatus = nextStatusMap[job.status];

              return (
                <Card
                  key={job.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-white text-base sm:text-lg">
                              {job.service?.name ?? "Service Work Order"}
                            </h2>

                            <Badge
                              variant={statusVariant(job.status)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md"
                            >
                              <span className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
                              {statusLabels[job.status]}
                            </Badge>
                          </div>

                          <p className="mt-1 font-mono text-xs text-slate-400">
                            Work Order #{job.id}
                          </p>
                        </div>

                        <p className="text-lg font-black text-white">
                          ৳{Number(job.servicePrice ?? 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-1 text-teal-400">
                            <UserRound className="size-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Customer
                            </p>

                            <p className="mt-0.5 font-bold text-white">
                              {job.customer?.name ?? "Customer"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-1 text-teal-400">
                            <MapPin className="size-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Location
                            </p>

                            <p className="mt-0.5 font-bold text-white">
                              {job.address?.city ??
                                job.address?.addressLine ??
                                "Address unavailable"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-1 text-teal-400">
                            <CalendarDays className="size-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Scheduled
                            </p>

                            <p className="mt-0.5 font-bold text-white">
                              {job.scheduledStart
                                ? new Date(job.scheduledStart).toLocaleString()
                                : "Not scheduled"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-1 text-teal-400">
                            <Clock3 className="size-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Updated
                            </p>

                            <p className="mt-0.5 font-bold text-white">
                              {new Date(job.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedJob(job)}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                        >
                          View job
                        </Button>

                        {nextStatus && (
                          <Button
                            onClick={() => setSelectedJob(job)}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-500 px-4 text-xs font-semibold text-slate-950 transition-all hover:bg-teal-400 active:scale-[0.98] shadow-lg shadow-teal-500/20"
                          >
                            <CheckCircle2 className="mr-2 size-4" />

                            {nextStatus === "EN_ROUTE"
                              ? "Start Travel"
                              : nextStatus === "IN_PROGRESS"
                                ? "Start Job"
                                : "Complete Job"}
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

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || jobsQuery.isFetching}
              onClick={handlePreviousPage}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || jobsQuery.isFetching}
              onClick={handleNextPage}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedJob)}
        onOpenChange={(open) => {
          if (!open && !statusMutation.isPending) {
            setSelectedJob(null);
            setCompletionNote("");
          }
        }}
      >
        <DialogContent className="border-white/10 bg-slate-900 text-slate-100 backdrop-blur-2xl shadow-2xl rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {selectedJob?.service?.name ?? "Work Order"}
            </DialogTitle>

            <DialogDescription className="text-xs text-slate-400">
              Review the work order and update its status.
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Current status
                  </span>

                  <Badge
                    variant={statusVariant(selectedJob.status)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md"
                  >
                    <span className="size-1.5 rounded-full bg-teal-400 animate-pulse" />
                    {statusLabels[selectedJob.status]}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Customer
                  </span>

                  <span className="text-xs font-bold text-white">
                    {selectedJob.customer?.name ?? "Customer"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Service price
                  </span>

                  <span className="text-xs font-black text-white">
                    ৳{Number(selectedJob.servicePrice ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedJob.status === "IN_PROGRESS" && (
                <div className="space-y-2">
                  <label
                    htmlFor="completion-note"
                    className="text-xs font-semibold text-slate-200 uppercase tracking-wider"
                  >
                    Completion note
                  </label>

                  <Textarea
                    id="completion-note"
                    value={completionNote}
                    onChange={(event) => setCompletionNote(event.target.value)}
                    placeholder="Add a short note about the completed work..."
                    rows={4}
                    maxLength={500}
                    className="rounded-xl border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-teal-400"
                  />

                  <p className="text-[10px] text-slate-400">
                    Maximum 500 characters.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedJob(null);
                setCompletionNote("");
              }}
              disabled={statusMutation.isPending}
              className="rounded-xl border-white/10 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Close
            </Button>

            {canStartNextStep && (
              <Button
                onClick={handleNextStatus}
                disabled={statusMutation.isPending}
                className="rounded-xl bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400"
              >
                {statusMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}

                {selectedNextStatus === "EN_ROUTE"
                  ? "Start Travel"
                  : selectedNextStatus === "IN_PROGRESS"
                    ? "Start Job"
                    : "Complete Job"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}