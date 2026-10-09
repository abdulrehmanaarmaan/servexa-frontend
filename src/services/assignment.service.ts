import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";

import type {
  Assignment,
  CreateAssignmentPayload,
} from "@/types/assignment";

export async function getAssignments(
  workOrderId: string,
): Promise<Assignment[]> {
  return apiFetch<Assignment[]>(
    endpoints.assignments.byWorkOrder(workOrderId),
  );
}

export async function createAssignment(
  workOrderId: string,
  payload: CreateAssignmentPayload,
): Promise<Assignment> {
  return apiFetch<Assignment>(
    endpoints.assignments.create(workOrderId),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function unassignTechnician(
  workOrderId: string,
  assignmentId: string,
): Promise<Assignment> {
  return apiFetch<Assignment>(
    endpoints.assignments.remove(
      assignmentId,
      workOrderId,
    ),
    {
      method: "DELETE",
    },
  );
}