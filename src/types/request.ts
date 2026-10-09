import type { Address } from "./address";
import type { CustomerProfile } from "./customer";
import type { Service } from "./service";
import type { WorkOrder } from "./work-order";

export type ServiceRequestStatus =
    | "PENDING"
    | "REVIEWED"
    | "APPROVED"
    | "REJECTED"
    | "CONVERTED"
    | "CANCELLED";

export type ServicePriority =
    | "LOW"
    | "NORMAL"
    | "HIGH"
    | "URGENT";

export interface ServiceRequest {
    id: string;

    customerId: string;
    serviceId: string;
    addressId: string;

    description: string;
    priority: ServicePriority;
    status: ServiceRequestStatus;

    customer?: CustomerProfile;
    service?: Service;
    address?: Address;

    workOrder?: WorkOrder | null;

    createdAt: string;
    updatedAt: string;
}