"use client";

import { FileText, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import WorkOrderStatusBadge from "./WorkOrderStatusBadge";

import { formatDate, formatPrice } from "@/lib/utils";

import type { WorkOrder } from "@/types/work-order";

interface WorkOrderTableRowProps {
  workOrder: WorkOrder;
  onEdit: (workOrder: WorkOrder) => void;
  onStatusChange: (workOrder: WorkOrder) => void;
  onSchedule: (workOrder: WorkOrder) => void;
  onCreateInvoice: (workOrder: WorkOrder) => void;
}

export default function WorkOrderTableRow({
  workOrder,
  onEdit,
  onStatusChange,
  onSchedule,
  onCreateInvoice,
}: WorkOrderTableRowProps) {
  const technician = workOrder.assignments?.[0]?.technician;

  const canCreateInvoice =
    workOrder.status === "COMPLETED" && !workOrder.invoice;

  return (
    <tr className="border-b border-white/5 transition-colors hover:bg-white/[0.025]">
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-white">
            #{workOrder.id.slice(0, 8)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {formatDate(workOrder.createdAt)}
          </p>
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="font-medium text-slate-200">
          {workOrder.service?.name ?? "Unknown service"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {formatPrice(workOrder.servicePrice ?? 0)}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm text-slate-200">
          {workOrder.customer?.name ?? "Unknown customer"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {workOrder.customer?.email ?? "No email"}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-sm text-slate-300">
          {technician?.name ?? "Not assigned"}
        </p>
      </td>

      <td className="px-4 py-4">
        <WorkOrderStatusBadge status={workOrder.status} />
      </td>

      <td className="px-4 py-4">
        <p className="text-sm text-slate-300">
          {workOrder.scheduledStart
            ? formatDate(workOrder.scheduledStart)
            : "Not scheduled"}
        </p>
      </td>

      <td className="px-4 py-4 text-right">
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
      </td>
    </tr>
  );
}