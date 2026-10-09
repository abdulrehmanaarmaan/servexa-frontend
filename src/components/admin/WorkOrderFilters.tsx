"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Filter,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  WORK_ORDER_SORT_FIELDS,
  WORK_ORDER_STATUSES,
  type SortOrder,
  type WorkOrderSortField,
  type WorkOrderStatus,
} from "@/types/work-order";

interface WorkOrderFiltersProps {
  status?: WorkOrderStatus;
  sortBy: WorkOrderSortField;
  sortOrder: SortOrder;
  onStatusChange: (value: WorkOrderStatus | "ALL") => void;
  onSortByChange: (value: WorkOrderSortField) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onReset: () => void;
}

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

const sortLabels: Record<WorkOrderSortField, string> = {
  createdAt: "Created date",
  scheduledStart: "Scheduled date",
  updatedAt: "Updated date",
};

export default function WorkOrderFilters({
  status,
  sortBy,
  sortOrder,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: WorkOrderFiltersProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl">
      <div className="mb-3.5 flex items-center gap-2">
        <Filter className="size-4 text-teal-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
          Filters &amp; sorting
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={status ?? "ALL"}
          onValueChange={(value) =>
            onStatusChange(value as WorkOrderStatus | "ALL")
          }
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950/80 text-sm text-slate-100 sm:h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent className="border-white/10 bg-slate-900 text-slate-100">
            <SelectItem value="ALL">All statuses</SelectItem>
            {WORK_ORDER_STATUSES.map((workOrderStatus) => (
              <SelectItem key={workOrderStatus} value={workOrderStatus}>
                {statusLabels[workOrderStatus]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) =>
            onSortByChange(value as WorkOrderSortField)
          }
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-slate-950/80 text-sm text-slate-100 sm:h-9">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="border-white/10 bg-slate-900 text-slate-100">
            {WORK_ORDER_SORT_FIELDS.map((field) => (
              <SelectItem key={field} value={field}>
                {sortLabels[field]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")
          }
          className="h-10 w-full justify-center rounded-xl border-white/10 bg-slate-950/80 text-xs text-slate-200 hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:h-9 sm:text-sm"
        >
          {sortOrder === "desc" ? (
            <ArrowDownAZ className="mr-2 size-4 text-teal-400" />
          ) : (
            <ArrowUpAZ className="mr-2 size-4 text-teal-400" />
          )}
          {sortOrder === "desc" ? "Newest first" : "Oldest first"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="h-10 w-full rounded-xl border-white/10 bg-slate-950/80 text-xs text-slate-200 hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:h-9 sm:text-sm"
        >
          <RotateCcw className="mr-2 size-4 text-teal-400" />
          Reset
        </Button>
      </div>
    </div>
  );
}