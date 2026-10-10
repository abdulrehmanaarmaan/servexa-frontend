"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { endpoints } from "@/lib/endpoints";

import { apiFetch } from "@/lib/api";
import type {
  Address,
  CreateAddressPayload,
} from "@/types/address";

const SKELETON_IDS = [
  "address-skeleton-1",
  "address-skeleton-2",
  "address-skeleton-3",
  "address-skeleton-4",
];

const addressFormSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, "Label cannot exceed 50 characters")
    .optional(),

  addressLine: z
    .string()
    .trim()
    .min(
      5,
      "Address must be at least 5 characters",
    )
    .max(
      500,
      "Address cannot exceed 500 characters",
    ),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(
      100,
      "City cannot exceed 100 characters",
    ),

  state: z
    .string()
    .trim()
    .max(
      100,
      "State cannot exceed 100 characters",
    )
    .optional(),

  postalCode: z
    .string()
    .trim()
    .max(
      20,
      "Postal code cannot exceed 20 characters",
    )
    .optional(),

  country: z
    .string()
    .trim()
    .min(
      2,
      "Country must be at least 2 characters",
    )
    .max(
      100,
      "Country cannot exceed 100 characters",
    ),
});

type AddressFormValues = z.infer<
  typeof addressFormSchema
>;

export default function AddressesClient() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["customer-addresses"],
    queryFn: () =>
      apiFetch<Address[]>(
        endpoints.addresses.list,
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch<Address>(
        endpoints.addresses.delete(id),
        {
          method: "DELETE",
        },
      ),

    onSuccess: () => {
      toast.success("Address deleted.");

      queryClient.invalidateQueries({
        queryKey: ["customer-addresses"],
      });
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to delete address.",
      );
    },
  });

  if (isLoading) {
    return (
      <section className="space-y-6 text-slate-100">
        <div>
          <div className="flex items-center gap-2 text-teal-400">
            <MapPin className="size-4 sm:size-5" />
            <span className="text-xs font-semibold tracking-wide sm:text-sm">
              Location Management
            </span>
          </div>

          <div className="mt-2 h-10 w-64 animate-pulse rounded-2xl bg-white/10" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SKELETON_IDS.map((id) => (
            <div
              key={id}
              className="h-40 w-full animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6 text-slate-100">
        <div>
          <div className="flex items-center gap-2 text-teal-400">
            <MapPin className="size-4 sm:size-5" />
            <span className="text-xs font-semibold tracking-wide sm:text-sm">
              Location Management
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            My Addresses
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            Manage your service addresses.
          </p>
        </div>

        <div
          role="alert"
          className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-red-200 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <h2 className="font-bold text-sm sm:text-base text-white">
            Failed to load addresses
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-red-300">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </p>
        </div>
      </section>
    );
  }

  const addresses = data ?? [];

  return (
    <section className="space-y-6 text-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal-400">
            <MapPin className="size-4 sm:size-5" />
            <span className="text-xs font-semibold tracking-wide sm:text-sm">
              Location Management
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            My Addresses
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            Manage your service addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm((value) => !value)
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] backdrop-blur-xl shadow-lg"
        >
          {showForm ? (
            <X className="size-4 text-teal-400" />
          ) : (
            <Plus className="size-4 text-teal-400" />
          )}

          {showForm
            ? "Close"
            : "Add Address"}
        </button>
      </div>

      {showForm && (
        <AddressForm
          onSuccess={() => {
            setShowForm(false);

            queryClient.invalidateQueries({
              queryKey: ["customer-addresses"],
            });
          }}
        />
      )}

      {addresses.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
            <MapPin className="size-6 text-teal-400" />
          </div>

          <p className="mt-4 text-base font-bold text-white sm:text-lg">
            No addresses added yet.
          </p>

          <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 sm:text-sm">
            Add an address to use it for your
            service requests.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={() =>
                deleteMutation.mutate(
                  address.id,
                )
              }
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables ===
                  address.id
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AddressCard({
  address,
  onDelete,
  isDeleting,
}: {
  address: Address;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-teal-400" />

            <h2 className="font-bold text-white text-sm sm:text-base">
              {address.label || "Address"}
            </h2>
          </div>

          <div className="mt-3 space-y-1 text-xs sm:text-sm text-slate-300">
            <p>{address.addressLine}</p>

            <p>
              {address.city}
              {address.state
                ? `, ${address.state}`
                : ""}
            </p>

            {address.postalCode && (
              <p>{address.postalCode}</p>
            )}

            <p className="text-slate-400">{address.country}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="inline-flex size-9 items-center justify-center shrink-0 rounded-xl border border-red-500/30 bg-red-950/40 text-red-400 transition-all hover:bg-red-900/50 hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Delete ${
            address.label || "address"
          }`}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </button>
      </div>
    </article>
  );
}

function AddressForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const mutation = useMutation({
    mutationFn: (
      payload: CreateAddressPayload,
    ) =>
      apiFetch<Address>(
        endpoints.addresses.create,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      ),

    onSuccess: () => {
      toast.success("Address added.");

      onSuccess();
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to add address.",
      );
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(
      addressFormSchema,
    ),
    defaultValues: {
      label: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Bangladesh",
    },
  });

  const onSubmit = (
    values: AddressFormValues,
  ) => {
    const payload: CreateAddressPayload = {
      ...(values.label
        ? { label: values.label }
        : {}),

      addressLine: values.addressLine,

      city: values.city,

      ...(values.state
        ? { state: values.state }
        : {}),

      ...(values.postalCode
        ? {
            postalCode:
              values.postalCode,
          }
        : {}),

      country: values.country,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const submitting =
    isSubmitting || mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6">
        <h2 className="font-bold text-white text-base sm:text-lg">
          Add New Address
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Enter the address where you need
          service.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="address-label"
          label="Label"
          error={errors.label?.message}
          className="sm:col-span-2"
        >
          <input
            id="address-label"
            {...register("label")}
            placeholder="Home, Office, etc."
            className="flex h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </FormField>

        <FormField
          id="address-line"
          label="Address"
          required
          error={errors.addressLine?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="address-line"
            {...register("addressLine")}
            placeholder="House, road, area..."
            rows={3}
            className="flex w-full rounded-xl border border-white/10 bg-slate-950/60 p-3.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </FormField>

        <FormField
          id="address-city"
          label="City"
          required
          error={errors.city?.message}
        >
          <input
            id="address-city"
            {...register("city")}
            placeholder="Chattogram"
            className="flex h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </FormField>

        <FormField
          id="address-state"
          label="State / Division"
          error={errors.state?.message}
        >
          <input
            id="address-state"
            {...register("state")}
            placeholder="Chattogram"
            className="flex h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </FormField>

        <FormField
          id="address-postal-code"
          label="Postal Code"
          error={errors.postalCode?.message}
        >
          <input
            id="address-postal-code"
            {...register("postalCode")}
            placeholder="4000"
            className="flex h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </FormField>

        <FormField
          id="address-country"
          label="Country"
          required
          error={errors.country?.message}
        >
          <input
            id="address-country"
            {...register("country")}
            className="flex h-10 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 text-xs font-semibold text-slate-950 transition-all hover:bg-teal-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 shadow-lg"
        >
          {submitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {submitting
            ? "Saving..."
            : "Save Address"}
        </button>
      </div>
    </form>
  );
}

function FormField({
  id,
  label,
  required = false,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-300"
      >
        {label}

        {required && (
          <span
            aria-hidden="true"
            className="ml-1 text-red-400"
          >
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}