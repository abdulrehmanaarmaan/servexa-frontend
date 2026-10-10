import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters"),

  email: z.string().email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters"),

  phone: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? undefined
        : value,
    z
      .string()
      .trim()
      .min(7, "Phone number must contain at least 7 characters.")
      .max(20, "Phone number cannot exceed 20 characters.")
      .optional(),
  ),
});

// Form input type: phone is a string because it comes from an input field.
export type RegisterFormInput = z.input<typeof registerSchema>;

// Validated output type: an empty phone string is transformed into undefined.
export type RegisterFormValues = z.output<typeof registerSchema>;

export const createServiceRequestSchema = z.object({
  serviceId: z.string().uuid("Please select a service."),

  addressId: z.string().uuid("Please select a service address."),

  scheduledAt: z
    .string()
    .min(1, "Please select a preferred date and time."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),

  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
});

export const serviceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters.")
    .max(100, "Service name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters.")
    .optional(),

  basePrice: z
    .number()
    .finite("Base price must be a valid number.")
    .nonnegative("Base price cannot be negative."),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;