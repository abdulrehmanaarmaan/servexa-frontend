"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
    AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { serviceService } from "@/services/service.service";
import type { Service } from "@/types/service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ServiceFormValues } from "@/lib/validation";
import ServiceTableRow from "@/components/admin/ServiceTableRow";
import ServiceMobileCard from "@/components/admin/ServiceMobileCard";
import ServiceTableSkeleton from "@/components/admin/ServiceTableSkeleton";
import EmptyServices from "@/components/admin/EmptyServices";
import ServiceFormDialog from "@/components/admin/ServiceFormDialog";

const LIMIT = 10;

type SortBy =
  | "name"
  | "basePrice"
  | "createdAt"
  | "updatedAt";

type SortOrder = "asc" | "desc";

export default function AdminServicesClient() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "true" | "false">("ALL");

  const [sortBy, setSortBy] =
    useState<SortBy>("createdAt");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("desc");

  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [deletingService, setDeletingService] =
    useState<Service | null>(null);

  const servicesQuery = useQuery({
    queryKey: [
      "admin",
      "services",
      {
        search,
        statusFilter,
        sortBy,
        sortOrder,
        page,
      },
    ],

    queryFn: () =>
      serviceService.list({
        search: search || undefined,

        isActive:
          statusFilter === "ALL"
            ? undefined
            : statusFilter === "true",

        sortBy,
        sortOrder,

        page,
        limit: LIMIT,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (
      values: ServiceFormValues,
    ) =>
      serviceService.create({
        name: values.name.trim(),
        description:
          values.description?.trim() || undefined,
        basePrice: values.basePrice,
      }),

    onSuccess: () => {
      toast.success(
        "Service created successfully.",
      );

      setIsFormOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["admin", "services"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: ServiceFormValues;
    }) =>
      serviceService.update(id, {
        name: values.name.trim(),
        description:
          values.description?.trim() || undefined,
        basePrice: values.basePrice,
      }),

    onSuccess: () => {
      toast.success(
        "Service updated successfully.",
      );

      setIsFormOpen(false);
      setEditingService(null);

      queryClient.invalidateQueries({
        queryKey: ["admin", "services"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const toggleStatusMutation =
    useMutation({
      mutationFn: ({
        id,
        isActive,
      }: {
        id: string;
        isActive: boolean;
      }) =>
        serviceService.update(id, {
          isActive,
        }),

      onSuccess: (_, variables) => {
        toast.success(
          variables.isActive
            ? "Service activated."
            : "Service deactivated.",
        );

        queryClient.invalidateQueries({
          queryKey: ["admin", "services"],
        });
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      serviceService.remove(id),

    onSuccess: () => {
      toast.success(
        "Service deleted successfully.",
      );

      setDeletingService(null);

      queryClient.invalidateQueries({
        queryKey: ["admin", "services"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const services =
    servicesQuery.data?.data ?? [];

  const meta =
    servicesQuery.data?.meta;

  const totalPages =
    meta?.totalPages ?? 1;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusFilter = (
    value: string | null,
  ) => {
    if (
      value !== "ALL" &&
      value !== "true" &&
      value !== "false"
    ) {
      return;
    }

    setStatusFilter(value);
    setPage(1);
  };

  const handleSort = (
    value: string | null,
  ) => {
    if (
      value !== "name" &&
      value !== "basePrice" &&
      value !== "createdAt" &&
      value !== "updatedAt"
    ) {
      return;
    }

    setSortBy(value);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((current) =>
      current === "asc"
        ? "desc"
        : "asc",
    );

    setPage(1);
  };

  const openCreateDialog = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (
    service: Service,
  ) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleSubmit = (
    values: ServiceFormValues,
  ) => {
    if (editingService) {
      updateMutation.mutate({
        id: editingService.id,
        values,
      });

      return;
    }

    createMutation.mutate(values);
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
            Administration
          </p>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Services
          </h1>

          <p className="max-w-2xl text-xs text-slate-400 sm:text-sm">
            Create, update, manage, and remove services available on Servexa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
          <Button
            variant="outline"
            onClick={() => servicesQuery.refetch()}
            disabled={servicesQuery.isFetching}
            className="h-10 flex-1 border-white/10 bg-slate-900 text-xs font-medium text-slate-200 transition-all hover:bg-white/5 hover:text-white active:scale-[0.98] sm:h-9 sm:flex-none sm:text-sm"
          >
            <RefreshCw
              className={`mr-2 size-3.5 ${
                servicesQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            onClick={openCreateDialog}
            className="h-10 flex-1 bg-teal-400 text-xs font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-9 sm:flex-none sm:text-sm"
          >
            <Plus className="mr-2 size-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl">
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
            {/* Search Controls */}
            <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search services..."
                  className="h-10 w-full rounded-xl border-white/10 bg-slate-950 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 sm:h-9 sm:text-sm"
                />
              </div>

              <Button
                onClick={handleSearch}
                className="h-10 shrink-0 bg-teal-400 px-4 font-semibold text-slate-950 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-9"
              >
                Search
              </Button>
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950 text-xs text-slate-200 backdrop-blur-sm focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 sm:h-9 sm:text-sm lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent className="border-white/10 bg-slate-900 text-slate-100 backdrop-blur-xl">
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950 text-xs text-slate-200 backdrop-blur-sm focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 sm:h-9 sm:text-sm lg:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent className="border-white/10 bg-slate-900 text-slate-100 backdrop-blur-xl">
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="updatedAt">Updated</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="basePrice">Price</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order Toggle */}
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className="h-10 border-white/10 bg-slate-950 text-xs text-slate-200 backdrop-blur-sm hover:bg-white/5 hover:text-white sm:h-9 sm:text-sm"
            >
              {sortOrder === "asc" ? (
                <ArrowUp className="mr-2 size-3.5 text-teal-400" />
              ) : (
                <ArrowDown className="mr-2 size-3.5 text-teal-400" />
              )}

              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {servicesQuery.isError && (
        <Card className="border-rose-500/30 bg-rose-500/10 backdrop-blur-md shadow-xl">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 text-rose-400" />
              <div>
                <p className="text-sm font-bold text-rose-200">
                  Failed to load services
                </p>

                <p className="mt-0.5 text-xs text-rose-300/80">
                  {servicesQuery.error instanceof Error
                    ? servicesQuery.error.message
                    : "Something went wrong while fetching catalog data."}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => servicesQuery.refetch()}
              className="h-9 shrink-0 border-rose-400/30 bg-transparent text-xs text-rose-200 hover:bg-rose-400/20 hover:text-white"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Services Content Container */}
      <Card className="overflow-hidden border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl">
        <CardHeader className="border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-teal-400" />
              <CardTitle className="text-base font-bold text-white sm:text-lg">
                Service Catalog
              </CardTitle>
            </div>

            {meta && (
              <span className="rounded-full border border-white/10 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-400">
                {meta.total} {meta.total === 1 ? "service" : "services"}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {servicesQuery.isPending ? (
            <ServiceTableSkeleton />
          ) : services.length === 0 ? (
            <EmptyServices
              hasSearch={Boolean(search)}
              onCreate={openCreateDialog}
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3.5">Service</th>
                      <th className="px-6 py-3.5">Price</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Created</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {services.map((service: any) => (
                      <ServiceTableRow
                        key={service.id}
                        service={service}
                        onEdit={() => openEditDialog(service)}
                        onToggle={() =>
                          toggleStatusMutation.mutate({
                            id: service.id,
                            isActive: !service.isActive,
                          })
                        }
                        onDelete={() => setDeletingService(service)}
                        isToggling={
                          toggleStatusMutation.isPending &&
                          toggleStatusMutation.variables?.id === service.id
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards List */}
              <div className="divide-y divide-white/10 md:hidden">
                {services.map((service: any) => (
                  <ServiceMobileCard
                    key={service.id}
                    service={service}
                    onEdit={() => openEditDialog(service)}
                    onToggle={() =>
                      toggleStatusMutation.mutate({
                        id: service.id,
                        isActive: !service.isActive,
                      })
                    }
                    onDelete={() => setDeletingService(service)}
                    isToggling={
                      toggleStatusMutation.isPending &&
                      toggleStatusMutation.variables?.id === service.id
                    }
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-slate-400 sm:text-left sm:text-sm">
            Showing page <span className="font-semibold text-white">{meta.page}</span> of{" "}
            <span className="font-semibold text-white">{meta.totalPages}</span>
          </p>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current: number) => Math.max(1, current - 1))}
              className="h-9 border-white/10 bg-slate-900 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current: number) => Math.min(totalPages, current + 1))}
              className="h-9 border-white/10 bg-slate-900 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <ServiceFormDialog
        open={isFormOpen}
        onOpenChange={(open: boolean) => {
          setIsFormOpen(open);
          if (!open) setEditingService(null);
        }}
        service={editingService}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deletingService)}
        onOpenChange={(open) => {
          if (!open) setDeletingService(null);
        }}
      >
        <DialogContent className="border-white/10 bg-slate-900 text-white backdrop-blur-xl sm:max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-white">
              Delete service?
            </DialogTitle>

            <DialogDescription className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              This will remove{" "}
              <span className="font-semibold text-slate-200">
                {deletingService?.name}
              </span>{" "}
              from the active service catalog.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingService(null)}
              className="h-9 border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deletingService) return;
                deleteMutation.mutate(deletingService.id);
              }}
              className="h-9 bg-rose-500 font-semibold text-white hover:bg-rose-600 sm:text-sm"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Delete Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}