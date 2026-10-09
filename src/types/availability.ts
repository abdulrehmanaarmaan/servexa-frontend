export type AvailabilityStatus =
    | "AVAILABLE"
    | "UNAVAILABLE"
    | "BOOKED";

export interface Availability {
    id: string;
    technicianId: string;
    startAt: string;
    endAt: string;
    status: AvailabilityStatus;
    createdAt: string;
    updatedAt: string;
}