"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
  serviceFormSchema,
  type ServiceFormValues,
} from "@/lib/validation";
import type { Service } from "@/types/service";

export default function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSubmit: (values: ServiceFormValues) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const isEditing = Boolean(service);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (service) {
      reset({
        name: service.name,
        description: service.description ?? "",
        basePrice: Number(service.basePrice),
      });
    } else {
      reset({
        name: "",
        description: "",
        basePrice: 0,
      });
    }
  }, [open, service, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-slate-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-white sm:text-lg">
            {isEditing ? "Edit Service" : "Create Service"}
          </DialogTitle>

          <DialogDescription className="text-xs text-slate-400 sm:text-sm">
            {isEditing
              ? "Update service details and pricing."
              : "Add a new service to the Servexa platform catalog."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-2"
        >
          {/* Service Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-name"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Service name
            </label>

            <Input
              id="service-name"
              {...register("name")}
              placeholder="e.g. AC Repair"
              className="h-10 rounded-xl border-white/10 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
            />

            {errors.name && (
              <p className="text-xs font-medium text-rose-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-description"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Description
            </label>

            <Textarea
              id="service-description"
              {...register("description")}
              placeholder="Describe the service..."
              rows={4}
              className="rounded-xl border-white/10 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
            />

            {errors.description && (
              <p className="text-xs font-medium text-rose-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Base Price */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-price"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Base price (৳)
            </label>

            <Input
              id="service-price"
              type="number"
              min="0"
              step="0.01"
              {...register("basePrice", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className="h-10 rounded-xl border-white/10 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
            />

            {errors.basePrice && (
              <p className="text-xs font-medium text-rose-400">
                {errors.basePrice.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-9 border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-teal-400 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:bg-teal-300 active:scale-[0.98] sm:text-sm"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {isEditing ? "Save Changes" : "Create Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}