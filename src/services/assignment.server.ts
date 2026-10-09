import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

import type { PaginatedData } from "@/types/api";
import type { Assignment } from "@/types/assignment";
import type { WorkOrder } from "@/types/dashboard";

export async function getAdminAssignmentWorkOrders(): Promise<WorkOrder[]> {
  const result = await serverApiFetch<PaginatedData<WorkOrder>>(
    endpoints.workOrders.list,
  );

  return result.data;
}

export async function getAssignments(
  workOrderId: string,
): Promise<Assignment[]> {
  return serverApiFetch<Assignment[]>(
    endpoints.assignments.byWorkOrder(workOrderId),
  );
}