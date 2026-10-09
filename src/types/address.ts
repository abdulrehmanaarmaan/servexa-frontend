export interface Address {
  id: string;
  customerId: string;

  label: string | null;
  addressLine: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;

  latitude: number | null;
  longitude: number | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateAddressPayload {
  label?: string;
  addressLine: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressPayload {
  label?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}