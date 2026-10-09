"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    AlertTriangle,
    CalendarDays,
    Loader2,
    MapPin,
    Plus,
    Send,
    Wrench,
} from "lucide-react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { createServiceRequestSchema } from "@/lib/validation";
import { addressService } from "@/services/address.service";
import {
    requestService,
    type CreateServiceRequestPayload,
} from "@/services/request.service";
import { serviceService } from "@/services/service.service";

type Values = z.infer<typeof createServiceRequestSchema>;

interface NewServiceRequestFormProps {
    initialServiceId?: string;
}

export default function NewServiceRequestForm({
    initialServiceId,
}: NewServiceRequestFormProps) {
    const router = useRouter();

    const form = useForm<Values>({
        resolver: zodResolver(createServiceRequestSchema),
        defaultValues: {
            serviceId: initialServiceId ?? "",
            addressId: "",
            scheduledAt: "",
            description: "",
            priority: "NORMAL",
        },
    });

    /*
     * Keep the form synchronized if the initial service ID
     * changes after the component has mounted.
     */
    useEffect(() => {
        if (initialServiceId) {
            form.setValue("serviceId", initialServiceId, {
                shouldValidate: true,
            });
        }
    }, [initialServiceId, form]);

    const servicesQuery = useQuery({
        queryKey: ["services", "create-request"],
        queryFn: () =>
            serviceService.list({
                page: 1,
                limit: 100,
            }),
    });

    const addressesQuery = useQuery({
        queryKey: ["addresses", "me"],
        queryFn: () => addressService.list(),
    });

    const createRequestMutation = useMutation({
        mutationFn: (payload: CreateServiceRequestPayload) =>
            requestService.create(payload),

        onSuccess: () => {
            router.push("/dashboard/customer/requests");
        },
    });

    const selectedServiceId = form.watch("serviceId");

    const selectedService = useMemo(() => {
        return servicesQuery.data?.data?.find(
            (service) => service.id === selectedServiceId,
        );
    }, [servicesQuery.data, selectedServiceId]);

    const onSubmit = (values: Values) => {
        const payload: CreateServiceRequestPayload = {
            serviceId: values.serviceId,
            addressId: values.addressId,
            description: values.description.trim(),
            scheduledAt: values.scheduledAt,
            priority: values.priority,
        };

        createRequestMutation.mutate(payload);
    };

    const isLoading =
        servicesQuery.isLoading || addressesQuery.isLoading;

    const isSubmitting = createRequestMutation.isPending;

    const hasAddresses = (addressesQuery.data?.length ?? 0) > 0;

    return (
        <Card className="overflow-hidden border-white/10 bg-slate-900 shadow-xl backdrop-blur-xl">
            <CardHeader className="border-b border-white/10 bg-slate-900/80 px-5 py-4 sm:px-6">
                <CardTitle className="text-base font-bold text-white sm:text-lg">
                    Request Details
                </CardTitle>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Service Selection */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="service"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-300 sm:text-sm"
                        >
                            Service
                        </Label>

                        <Select
                            value={form.watch("serviceId")}
                            onValueChange={(value) => {
                                form.setValue("serviceId", value!, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            disabled={isLoading || isSubmitting}
                        >
                            <SelectTrigger
                                id="service"
                                className="h-10 w-full rounded-xl border-white/10 bg-slate-950 text-sm text-slate-100 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 sm:h-11"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <Wrench className="size-4 shrink-0 text-teal-400" />

                                    <SelectValue placeholder="Select a service" />
                                </div>
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-slate-900 text-slate-100 backdrop-blur-xl">
                                {servicesQuery.data?.data?.map((service) => (
                                    <SelectItem
                                        key={service.id}
                                        value={service.id}
                                    >
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {form.formState.errors.serviceId && (
                            <p className="text-xs font-medium text-rose-400 sm:text-sm">
                                {
                                    form.formState.errors.serviceId
                                        .message
                                }
                            </p>
                        )}

                        {/* Selected Service Details */}
                        {selectedService && (
                            <div className="rounded-xl border border-teal-400/20 bg-slate-950/80 p-3.5 sm:p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white">
                                            {selectedService.name}
                                        </p>

                                        {selectedService.description && (
                                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                                {
                                                    selectedService.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <p className="shrink-0 text-sm font-black text-teal-400 sm:text-base">
                                        {selectedService.basePrice !=
                                        null
                                            ? `৳${Number(
                                                  selectedService.basePrice,
                                              ).toLocaleString()}`
                                            : "Price varies"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Services Query Error */}
                        {servicesQuery.isError && (
                            <Alert
                                variant="destructive"
                                className="mt-3 border-rose-500/30 bg-rose-500/10 text-rose-300"
                            >
                                <AlertTriangle className="size-4 text-rose-400" />

                                <AlertTitle className="text-xs font-bold text-rose-200 sm:text-sm">
                                    Unable to load services
                                </AlertTitle>

                                <AlertDescription className="text-xs text-rose-300/90 sm:text-sm">
                                    {servicesQuery.error instanceof Error
                                        ? servicesQuery.error.message
                                        : "Failed to load available services."}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Service Address */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="address"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-300 sm:text-sm"
                        >
                            Service Address
                        </Label>

                        <Select
                            value={form.watch("addressId")}
                            onValueChange={(value) => {
                                form.setValue("addressId", value!, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            disabled={
                                addressesQuery.isLoading ||
                                isSubmitting ||
                                !hasAddresses
                            }
                        >
                            <SelectTrigger
                                id="address"
                                className="h-10 w-full rounded-xl border-white/10 bg-slate-950 text-sm text-slate-100 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-50 sm:h-11"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <MapPin className="size-4 shrink-0 text-teal-400" />

                                    <SelectValue
                                        placeholder={
                                            !hasAddresses
                                                ? "No saved addresses available"
                                                : "Select your service address"
                                        }
                                    />
                                </div>
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-slate-900 text-slate-100 backdrop-blur-xl">
                                {addressesQuery.data?.map((address) => (
                                    <SelectItem
                                        key={address.id}
                                        value={address.id}
                                    >
                                        {address.addressLine},{" "}
                                        {address.city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {form.formState.errors.addressId && (
                            <p className="text-xs font-medium text-rose-400 sm:text-sm">
                                {
                                    form.formState.errors.addressId
                                        .message
                                }
                            </p>
                        )}

                        {/* Empty Address State */}
                        {!addressesQuery.isLoading &&
                            !addressesQuery.isError &&
                            !hasAddresses && (
                                <Alert className="mt-3 border-amber-500/30 bg-amber-500/10 text-amber-200 backdrop-blur-md">
                                    <AlertTriangle className="size-4 text-amber-400" />

                                    <AlertTitle className="text-xs font-bold text-amber-200 sm:text-sm">
                                        No saved addresses found
                                    </AlertTitle>

                                    <AlertDescription className="mt-1 flex flex-col gap-3 text-xs text-amber-300/90 sm:flex-row sm:items-center sm:justify-between">
                                        <span>
                                            Please add an address before
                                            submitting a service request.
                                        </span>

                                        <Link
                                            href="/dashboard/customer/addresses/new"
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "xs",
                                                }),
                                                "inline-flex shrink-0 items-center border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 hover:text-white",
                                            )}
                                        >
                                            <Plus className="mr-1 size-3" />
                                            Add Address
                                        </Link>
                                    </AlertDescription>
                                </Alert>
                            )}

                        {/* Address Query Error */}
                        {addressesQuery.isError && (
                            <Alert
                                variant="destructive"
                                className="mt-3 border-rose-500/30 bg-rose-500/10 text-rose-300"
                            >
                                <AlertTriangle className="size-4 text-rose-400" />

                                <AlertTitle className="text-xs font-bold text-rose-200 sm:text-sm">
                                    Unable to load addresses
                                </AlertTitle>

                                <AlertDescription className="text-xs text-rose-300/90 sm:text-sm">
                                    {addressesQuery.error instanceof Error
                                        ? addressesQuery.error.message
                                        : "Failed to load your saved addresses."}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Preferred Date & Time */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="scheduledAt"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-300 sm:text-sm"
                        >
                            Preferred Date & Time
                        </Label>

                        <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                            <input
                                id="scheduledAt"
                                type="datetime-local"
                                {...form.register("scheduledAt")}
                                disabled={isSubmitting}
                                className="h-10 w-full rounded-xl border border-white/10 bg-slate-950 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all [color-scheme:dark] focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
                            />
                        </div>

                        {form.formState.errors.scheduledAt && (
                            <p className="text-xs font-medium text-rose-400 sm:text-sm">
                                {
                                    form.formState.errors.scheduledAt
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Priority Selection */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="priority"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-300 sm:text-sm"
                        >
                            Priority
                        </Label>

                        <Select
                            value={form.watch("priority")}
                            onValueChange={(value) => {
                                form.setValue(
                                    "priority",
                                    value as Values["priority"],
                                    {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    },
                                );
                            }}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger
                                id="priority"
                                className="h-10 w-full rounded-xl border-white/10 bg-slate-950 text-sm text-slate-100 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20 sm:h-11"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="border-white/10 bg-slate-900 text-slate-100 backdrop-blur-xl">
                                <SelectItem value="LOW">
                                    Low
                                </SelectItem>

                                <SelectItem value="NORMAL">
                                    Normal
                                </SelectItem>

                                <SelectItem value="HIGH">
                                    High
                                </SelectItem>

                                <SelectItem value="URGENT">
                                    Urgent
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {form.formState.errors.priority && (
                            <p className="text-xs font-medium text-rose-400 sm:text-sm">
                                {
                                    form.formState.errors.priority
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="description"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-300 sm:text-sm"
                        >
                            Description
                        </Label>

                        <Textarea
                            id="description"
                            {...form.register("description")}
                            disabled={isSubmitting}
                            placeholder="Describe the service you need..."
                            className="min-h-32 rounded-xl border-white/10 bg-slate-950 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
                        />

                        <div className="flex items-center justify-between gap-4">
                            {form.formState.errors.description ? (
                                <p className="text-xs font-medium text-rose-400 sm:text-sm">
                                    {
                                        form.formState.errors.description
                                            .message
                                    }
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500">
                                    Minimum 10 characters.
                                </p>
                            )}

                            <span className="shrink-0 font-mono text-xs text-slate-500">
                                {(
                                    form.watch("description") || ""
                                ).length}
                                /2000
                            </span>
                        </div>
                    </div>

                    {/* API Error */}
                    {createRequestMutation.isError && (
                        <Alert
                            variant="destructive"
                            className="border-rose-500/30 bg-rose-500/10 text-rose-300 backdrop-blur-md"
                        >
                            <AlertTriangle className="size-4 text-rose-400" />

                            <AlertTitle className="text-xs font-bold text-rose-200 sm:text-sm">
                                Submission Failed
                            </AlertTitle>

                            <AlertDescription className="text-xs text-rose-300/90 sm:text-sm">
                                {createRequestMutation.error instanceof
                                Error
                                    ? createRequestMutation.error.message
                                    : "Failed to create the service request. Please try again."}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() =>
                                router.push(
                                    "/dashboard/customer/requests",
                                )
                            }
                            className="h-10 w-full border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white sm:h-9 sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isLoading ||
                                !hasAddresses
                            }
                            className="h-10 w-full bg-teal-400 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 hover:shadow-teal-500/30 active:scale-[0.98] sm:h-9 sm:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 size-4" />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}