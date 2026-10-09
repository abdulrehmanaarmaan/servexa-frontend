import { User } from "./auth";

export interface CustomerAddress {
    id: string;
    addressLine: string;
    city: string;
    postalCode?: string | null;
    country?: string | null;
}

export interface CustomerProfile {
    id: string;
    userId: string;
    user?: User
    name: string;
    phone: string | null;
    company: string | null;
    addresses: CustomerAddress[];
}