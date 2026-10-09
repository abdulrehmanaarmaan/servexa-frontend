export interface AssignmentUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  isActive: boolean;
}

export interface AssignmentTechnician {
  id: string;
  user: AssignmentUser;
}

export interface Assignment {
  id: string;
  workOrderId: string;
  technicianId: string;
  assignedAt: string;
  unassignedAt: string | null;
  technician: AssignmentTechnician;
}

export interface CreateAssignmentPayload {
  technicianId: string;
}