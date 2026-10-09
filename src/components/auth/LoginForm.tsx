"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { toast } from "sonner";

import {
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
} from "lucide-react";

import { useState } from "react";

import type { z } from "zod";

import { authService } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginSchema } from "@/lib/validation";

import { GoogleLoginButton } from "./GoogleLoginButton";

type LoginValues = z.infer<
    typeof loginSchema
>;

function getSafeCallbackUrl(
    callbackUrl: string | null,
): string | null {
    if (!callbackUrl) {
        return null;
    }

    /*
     * Only allow internal application paths.
     *
     * Prevent:
     * https://malicious-site.com
     * //malicious-site.com
     */
    if (
        !callbackUrl.startsWith("/") ||
        callbackUrl.startsWith("//")
    ) {
        return null;
    }

    return callbackUrl;
}

export default function LoginForm() {
    const router = useRouter();
    const searchParams =
        useSearchParams();

    const [showPassword, setShowPassword] =
        useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(
        values: LoginValues,
    ) {
        try {
            const { user } =
                await authService.login(values);

            toast.success(
                "Signed in successfully.",
            );

            const callbackUrl =
                getSafeCallbackUrl(
                    searchParams.get(
                        "callbackUrl",
                    ),
                );

            /*
             * If middleware originally sent the
             * user here because they attempted to
             * access a protected route, return them
             * to that route.
             *
             * window.location.replace() is used
             * intentionally here so the login page
             * is replaced at the browser-history level.
             */
            if (callbackUrl) {
                window.location.replace(
                    callbackUrl
                );

                return;
            }

            /*
             * No callback URL means this was a
             * normal login.
             */
            if (
                user?.role === "CUSTOMER"
            ) {
                window.location.replace(
                    "/dashboard/customer",
                );
            } else if (
                user?.role === "TECHNICIAN"
            ) {
                window.location.replace(
                    "/dashboard/technician",
                );
            } else if (
                user?.role === "ADMIN"
            ) {
                window.location.replace(
                    "/dashboard/admin",
                );
            } else {
                toast.error(
                    "Your account does not have a valid role.",
                );
            }
        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error,
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to sign in.",
            );
        }
    }

    return (
        <div className="space-y-6">
            <form
                onSubmit={form.handleSubmit(
                    onSubmit,
                )}
                className="space-y-5"
            >
                {/* Email */}
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                        Email
                    </Label>

                    <div className="relative rounded-xl transition-all focus-within:ring-2 focus-within:ring-teal-400/50">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <Mail className="size-4" />
                        </div>

                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            {...form.register(
                                "email",
                            )}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
                        />
                    </div>

                    {form.formState.errors
                        .email && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
                            <AlertCircle className="size-3.5 shrink-0" />

                            <span>
                                {
                                    form
                                        .formState
                                        .errors
                                        .email
                                        .message
                                }
                            </span>
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                        Password
                    </Label>

                    <div className="relative rounded-xl transition-all focus-within:ring-2 focus-within:ring-teal-400/50">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                            <Lock className="size-4" />
                        </div>

                        <Input
                            id="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="••••••••"
                            {...form.register(
                                "password",
                            )}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-11 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (
                                        previous,
                                    ) =>
                                        !previous,
                                )
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-200"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    {form.formState.errors
                        .password && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
                            <AlertCircle className="size-3.5 shrink-0" />

                            <span>
                                {
                                    form
                                        .formState
                                        .errors
                                        .password
                                        .message
                                }
                            </span>
                        </p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={
                        form.formState
                            .isSubmitting
                    }
                    className="w-full rounded-xl bg-teal-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 hover:shadow-teal-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {form.formState.isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="size-4 animate-spin text-slate-950" />

                            <span>
                                Signing in...
                            </span>
                        </div>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-white/10" />

                <span className="absolute bg-slate-900/90 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Or continue with
                </span>
            </div>

            <GoogleLoginButton />
        </div>
    );
}