"use client";

import {
  CalendarDays,
  FileText,
  MapPin,
  MoreHorizontal,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import WorkOrderStatusBadge from "./WorkOrderStatusBadge";

import { formatDate, formatPrice } from "@/lib/utils";

import type { WorkOrder } from "@/types/work-order";

interface WorkOrderMobileCardProps {
  workOrder: WorkOrder;
  onEdit: (workOrder: WorkOrder) => void;
  onStatusChange: (workOrder: WorkOrder) => void;
  onSchedule: (workOrder: WorkOrder) => void;
  onCreateInvoice: (workOrder: WorkOrder) => void;
}

export default function WorkOrderMobileCard({
  workOrder,
  onEdit,
  onStatusChange,
  onSchedule,
  onCreateInvoice,
}: WorkOrderMobileCardProps) {
  const technician = workOrder.assignments?.[0]?.technician;

  const canCreateInvoice =
    workOrder.status === "COMPLETED" && !workOrder.invoice;

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">
            #{workOrder.id.slice(0, 8)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Created {formatDate(workOrder.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <WorkOrderStatusBadge status={workOrder.status} />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Open work order actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="border-white/10 bg-slate-900 text-slate-200"
            >
              <DropdownMenuItem onClick={() => onEdit(workOrder)}>
                Edit description
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onStatusChange(workOrder)}>
                Change status
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={
                  workOrder.status === "COMPLETED" ||
                  workOrder.status === "CANCELLED"
                }
                onClick={() => onSchedule(workOrder)}
              >
                Schedule work order
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={!canCreateInvoice}
                onClick={() => onCreateInvoice(workOrder)}
              >
                <FileText className="mr-2 size-4" />
                Create invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-start gap-3">
          <Wrench className="mt-0.5 size-4 shrink-0 text-teal-400" />

          <div>
            <p className="text-sm font-medium text-slate-200">
              {workOrder.service?.name ?? "Unknown service"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatPrice(workOrder.servicePrice ?? 0)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 size-4 shrink-0 text-teal-400" />

          <div>
            <p className="text-sm text-slate-300">
              {workOrder.customer?.name ?? "Unknown customer"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {workOrder.customer?.email ?? "No email"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Wrench className="mt-0.5 size-4 shrink-0 text-teal-400" />

          <div>
            <p className="text-xs text-slate-500">Technician</p>

            <p className="mt-1 text-sm text-slate-300">
              {technician?.name ?? "Not assigned"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-teal-400" />

          <div>
            <p className="text-xs text-slate-500">Schedule</p>

            <p className="mt-1 text-sm text-slate-300">
              {workOrder.scheduledStart
                ? formatDate(workOrder.scheduledStart)
                : "Not scheduled"}
            </p>
          </div>
        </div>

        {workOrder.address && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />

            <div>
              <p className="text-xs text-slate-500">Address</p>

              <p className="mt-1 text-sm text-slate-300">
                {workOrder.address.addressLine ??
                  workOrder.address.label ??
                  "Address available"}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}