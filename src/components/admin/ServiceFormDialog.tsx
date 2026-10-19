"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
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
import type { Service, ServiceImageChange } from "@/types/service";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
    onSubmit: (
        values: ServiceFormValues,
        image: ServiceImageChange,
    ) => void;
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

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removeExisting, setRemoveExisting] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

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

        setFile(null);
        setPreviewUrl(null);
        setRemoveExisting(false);
        setImageError(null);
    }, [open, service, reset]);

    // Free the temporary browser preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selected = event.target.files?.[0];

        // Allow selecting the same file again later
        event.target.value = "";

        if (!selected) {
            return;
        }

        if (!ALLOWED_TYPES.includes(selected.type)) {
            setImageError("Only JPG, PNG or WebP images are allowed.");
            return;
        }

        if (selected.size > MAX_IMAGE_SIZE) {
            setImageError("Image must be 4 MB or smaller.");
            return;
        }

        setImageError(null);
        setRemoveExisting(false);
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreviewUrl(null);
        setImageError(null);

        if (service?.imageUrl) {
            setRemoveExisting(true);
        }
    };

    const displayedImage =
        previewUrl ?? (removeExisting ? null : (service?.imageUrl ?? null));

    const submitHandler = (values: ServiceFormValues) => {
        onSubmit(values, { file, remove: removeExisting });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-900 text-white shadow-2xl backdrop-blur-xl sm:max-w-lg">
                <DialogHeader className="space-y-1.5 border-b border-white/10 pb-4">
                    <DialogTitle className="text-lg font-bold text-white sm:text-xl">
                        {isEditing ? "Edit Service" : "Create Service"}
                    </DialogTitle>

                    <DialogDescription className="text-xs text-slate-400 sm:text-sm">
                        {isEditing
                            ? "Update service details, pricing and image."
                            : "Add a new service to the Servexa platform catalog."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="space-y-5 pt-4"
                >
                    {/* Service Image */}
                    <div className="space-y-2">
                        <label
                            htmlFor="service-image"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                        >
                            Service image
                        </label>

                        <div className="overflow-hidden rounded-2xl border border-dashed border-white/15 bg-slate-950 transition-all hover:border-teal-400/40">
                            {displayedImage ? (
                                <div className="relative aspect-[16/10] w-full">
                                    {/* Plain img: previews may be local blob: URLs */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={displayedImage}
                                        alt="Service preview"
                                        className="size-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2.5 p-4 text-slate-500">
                                    <div className="flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 shadow-inner">
                                        <ImagePlus className="size-6" />
                                    </div>
                                    <p className="text-xs font-medium text-slate-400">
                                        JPG, PNG or WebP, up to 4 MB
                                    </p>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            id="service-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                            className="sr-only"
                        />

                        <div className="flex flex-wrap gap-2 pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isSubmitting}
                                onClick={() => fileInputRef.current?.click()}
                                className="h-10 rounded-xl border-white/10 bg-slate-950 text-xs font-semibold text-slate-200 backdrop-blur-sm hover:bg-slate-800 hover:text-white"
                            >
                                <ImagePlus className="mr-2 size-4 text-teal-400" />
                                {displayedImage ? "Replace image" : "Choose image"}
                            </Button>

                            {displayedImage && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isSubmitting}
                                    onClick={handleRemoveImage}
                                    className="h-10 rounded-xl border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Remove
                                </Button>
                            )}
                        </div>

                        {imageError && (
                            <p className="text-xs font-medium text-rose-400">
                                {imageError}
                            </p>
                        )}
                    </div>

                    {/* Service Name */}
                    <div className="space-y-2">
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
                            className="h-11 rounded-2xl border-white/10 bg-slate-950 px-4 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
                        />

                        {errors.name && (
                            <p className="text-xs font-medium text-rose-400">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
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
                            className="rounded-2xl border-white/10 bg-slate-950 p-4 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
                        />

                        {errors.description && (
                            <p className="text-xs font-medium text-rose-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Base Price */}
                    <div className="space-y-2">
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
                            className="h-11 rounded-2xl border-white/10 bg-slate-950 px-4 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
                        />

                        {errors.basePrice && (
                            <p className="text-xs font-medium text-rose-400">
                                {errors.basePrice.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-2.5 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="h-11 rounded-xl border-white/10 bg-slate-950 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white sm:text-sm"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 rounded-xl bg-teal-400 font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98] sm:text-sm"
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}

                            {isSubmitting
                                ? file
                                    ? "Uploading..."
                                    : "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create Service"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}