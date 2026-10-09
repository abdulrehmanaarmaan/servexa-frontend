import { endpoints } from "@/lib/endpoints";
import { apiFetch } from "@/lib/api";

import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/types/address";


export const addressService = {
  list() {
    return apiFetch<Address[]>(endpoints.addresses.list);
  },

  getById(id: string) {
    return apiFetch<Address>(
      endpoints.addresses.detail(id),
    );
  },

  create(payload: CreateAddressPayload) {
    return apiFetch<Address>(
      endpoints.addresses.create,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  update(
    id: string,
    payload: UpdateAddressPayload,
  ) {
    return apiFetch<Address>(
      endpoints.addresses.update(id),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
  },

  delete(id: string) {
    return apiFetch<Address>(
      endpoints.addresses.delete(id),
      {
        method: "DELETE",
      },
    );
  },
};