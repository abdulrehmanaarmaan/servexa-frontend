"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Phone,
    User,
} from "lucide-react";
import { useState } from "react";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    RegisterFormInput,
    RegisterFormValues,
    registerSchema,
} from "@/lib/validation";

import { GoogleLoginButton } from "./GoogleLoginButton";

// text-base on mobile stops iOS from zooming in when an input is focused.
// The dark: classes stop the shadcn Input's own dark background from
// overriding this one.
const inputBaseClassName =
    "h-11 w-full min-w-0 rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 text-base text-slate-100 backdrop-blur-sm transition-colors placeholder:text-slate-500 focus-visible:border-teal-400/80 focus-visible:ring-2 focus-visible:ring-teal-400/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm dark:border-white/10 dark:bg-slate-950/60 dark:disabled:bg-slate-950/60";

const inputClassName = `${inputBaseClassName} pr-4`;

// [&::-ms-reveal]:hidden removes Edge's built-in reveal icon (we have our own)
const passwordInputClassName = `${inputBaseClassName} pr-12 [&::-ms-reveal]:hidden`;

const labelClassName =
    "text-xs font-semibold uppercase tracking-wider text-slate-300";

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<
        RegisterFormInput,
        undefined,
        RegisterFormValues
    >({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        try {
            await authService.register(values);

            toast.success("Account created successfully.");

            const callbackUrl = searchParams.get("callbackUrl");

            if (
                callbackUrl &&
                callbackUrl.startsWith("/") &&
                !callbackUrl.startsWith("//")
            ) {
                router.replace(
                    `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
                );
            } else {
                router.replace("/auth/login");
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Registration failed.",
            );
        }
    }

    return (
        <div className="w-full min-w-0 space-y-6 scheme-dark">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="min-w-0 space-y-5"
            >
                <div className="min-w-0 space-y-2">
                    <Label htmlFor="register-name" className={labelClassName}>
                        Name
                    </Label>

                    <div className="relative min-w-0">
                        <User
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            id="register-name"
                            autoComplete="name"
                            placeholder="John Doe"
                            disabled={form.formState.isSubmitting}
                            aria-invalid={Boolean(
                                form.formState.errors.name,
                            )}
                            {...form.register("name")}
                            className={inputClassName}
                        />
                    </div>

                    {form.formState.errors.name && (
                        <p
                            role="alert"
                            className="flex items-start gap-1.5 break-words text-xs font-medium leading-5 text-rose-400"
                        >
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            <span>
                                {form.formState.errors.name.message}
                            </span>
                        </p>
                    )}
                </div>

                <div className="min-w-0 space-y-2">
                    <Label htmlFor="register-email" className={labelClassName}>
                        Email
                    </Label>

                    <div className="relative min-w-0">
                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="name@company.com"
                            disabled={form.formState.isSubmitting}
                            aria-invalid={Boolean(
                                form.formState.errors.email,
                            )}
                            {...form.register("email")}
                            className={inputClassName}
                        />
                    </div>

                    {form.formState.errors.email && (
                        <p
                            role="alert"
                            className="flex items-start gap-1.5 break-words text-xs font-medium leading-5 text-rose-400"
                        >
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            <span>
                                {form.formState.errors.email.message}
                            </span>
                        </p>
                    )}
                </div>

                <div className="min-w-0 space-y-2">
                    <Label htmlFor="register-phone" className={labelClassName}>
                        Phone{" "}
                        <span className="font-normal normal-case tracking-normal text-slate-500">
                            (optional)
                        </span>
                    </Label>

                    <div className="relative min-w-0">
                        <Phone
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            id="register-phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+880 1XXXXXXXXX"
                            disabled={form.formState.isSubmitting}
                            aria-invalid={Boolean(
                                form.formState.errors.phone,
                            )}
                            {...form.register("phone")}
                            className={inputClassName}
                        />
                    </div>

                    {form.formState.errors.phone && (
                        <p
                            role="alert"
                            className="flex items-start gap-1.5 break-words text-xs font-medium leading-5 text-rose-400"
                        >
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            <span>
                                {form.formState.errors.phone.message}
                            </span>
                        </p>
                    )}
                </div>

                <div className="min-w-0 space-y-2">
                    <Label
                        htmlFor="register-password"
                        className={labelClassName}
                    >
                        Password
                    </Label>

                    <div className="relative min-w-0">
                        <Lock
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Create a password"
                            disabled={form.formState.isSubmitting}
                            aria-invalid={Boolean(
                                form.formState.errors.password,
                            )}
                            {...form.register("password")}
                            className={passwordInputClassName}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((previous) => !previous)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            aria-pressed={showPassword}
                            disabled={form.formState.isSubmitting}
                            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:opacity-50"
                        >
                            {showPassword ? (
                                <EyeOff
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            ) : (
                                <Eye
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            )}
                        </button>
                    </div>

                    {form.formState.errors.password && (
                        <p
                            role="alert"
                            className="flex items-start gap-1.5 break-words text-xs font-medium leading-5 text-rose-400"
                        >
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            <span>
                                {form.formState.errors.password.message}
                            </span>
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="min-h-11 w-full rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-colors hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {form.formState.isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                            Creating account...
                        </span>
                    ) : (
                        "Create account"
                    )}
                </Button>
            </form>

            <div className="min-w-0 space-y-4">
                {/* Lines on both sides of the text: no background color to match */}
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />

                    <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Or continue with
                    </span>

                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <GoogleLoginButton />
            </div>
        </div>
    );
}