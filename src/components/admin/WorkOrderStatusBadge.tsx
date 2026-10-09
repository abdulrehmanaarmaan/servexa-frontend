import {
  Badge,
} from "@/components/ui/badge";

import type {
  WorkOrderStatus,
} from "@/types/work-order";

interface WorkOrderStatusBadgeProps {
  status: WorkOrderStatus;
}

const statusConfig: Record<
  WorkOrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  OPEN: {
    label: "Open",
    className:
      "border-sky-400/20 bg-sky-400/10 text-sky-300",
  },

  SCHEDULED: {
    label: "Scheduled",
    className:
      "border-violet-400/20 bg-violet-400/10 text-violet-300",
  },

  ASSIGNED: {
    label: "Assigned",
    className:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  },

  EN_ROUTE: {
    label: "En Route",
    className:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className:
      "border-teal-400/20 bg-teal-400/10 text-teal-300",
  },

  ON_HOLD: {
    label: "On Hold",
    className:
      "border-orange-400/20 bg-orange-400/10 text-orange-300",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
  },
};

export default function WorkOrderStatusBadge({
  status,
}: WorkOrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}