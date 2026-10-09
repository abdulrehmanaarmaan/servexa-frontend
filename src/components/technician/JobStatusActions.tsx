"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  workOrderService,
} from "@/services/work-order.service";

import { Button } from "@/components/ui/button";
import { WorkOrderStatus } from "@/types/work-order";

export default function JobStatusActions({
  workOrderId,
  currentStatus,
}: {
  workOrderId: string;
  currentStatus: string;
}) {
  const queryClient =
    useQueryClient();

  const mutation =
    useMutation({
      mutationFn: (status: WorkOrderStatus) =>
        workOrderService.updateWorkOrderStatus(
          workOrderId,
          {status}
        ),

      onSuccess: () => {
        toast.success(
          "Job status updated."
        );

        queryClient.invalidateQueries({
          queryKey: ["work-orders"],
        });
      },

      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to update status."
        );
      },
    });

  if (
    currentStatus === "COMPLETED" ||
    currentStatus === "CANCELLED"
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === "ASSIGNED" && (
        <Button
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate(
              "IN_PROGRESS"
            )
          }
        >
          Start job
        </Button>
      )}

      {currentStatus === "IN_PROGRESS" && (
        <Button
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate(
              "COMPLETED"
            )
          }
        >
          Complete job
        </Button>
      )}
    </div>
  );
}