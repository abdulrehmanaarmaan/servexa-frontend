"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    UserRound,
    Wrench,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import type { z } from "zod";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validation";
import { GoogleLoginButton } from "./GoogleLoginButton";

type LoginValues = z.infer<typeof loginSchema>;
type DemoRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

interface DemoAccount {
    role: DemoRole;
    label: string;
    email: string;
    password: string;
    icon: typeof UserRound;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
    {
        role: "CUSTOMER",
        label: "Customer",
        email:
            process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL ??
            "customer.demo@servexa.com",
        password:
            process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD ??
            "Demo@123456",
        icon: UserRound,
    },
    {
        role: "TECHNICIAN",
        label: "Technician",
        email:
            process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL ??
            "technician.demo@servexa.com",
        password:
            process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD ??
            "Demo@123456",
        icon: Wrench,
    },
    {
        role: "ADMIN",
        label: "Admin",
        email:
            process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ??
            "admin.demo@servexa.com",
        password:
            process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ??
            "Demo@123456",
        icon: ShieldCheck,
    },
];

const ROLE_DASHBOARDS: Record<DemoRole, string> = {
    CUSTOMER: "/dashboard/customer",
    TECHNICIAN: "/dashboard/technician",
    ADMIN: "/dashboard/admin",
};

function getSafeCallbackUrl(
    callbackUrl: string | null,
): string | null {
    if (
        !callbackUrl ||
        !callbackUrl.startsWith("/") ||
        callbackUrl.startsWith("//")
    ) {
        return null;
    }

    return callbackUrl;
}

function isDemoRole(role: unknown): role is DemoRole {
    return (
        role === "CUSTOMER" ||
        role === "TECHNICIAN" ||
        role === "ADMIN"
    );
}

export default function LoginForm() {
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);
    const [demoRoleLoading, setDemoRoleLoading] =
        useState<DemoRole | null>(null);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isBusy =
        form.formState.isSubmitting ||
        demoRoleLoading !== null;

    async function signIn(values: LoginValues) {
        try {
            const { user } = await authService.login(values);

            if (!user || !isDemoRole(user.role)) {
                toast.error(
                    "Your account does not have a valid role.",
                );
                return;
            }

            toast.success("Signed in successfully.");

            const callbackUrl = getSafeCallbackUrl(
                searchParams.get("callbackUrl"),
            );

            window.location.replace(
                callbackUrl ?? ROLE_DASHBOARDS[user.role],
            );
        } catch (error) {
            console.error("LOGIN ERROR:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to sign in. Please try again.",
            );
        }
    }

    async function onSubmit(values: LoginValues) {
        await signIn(values);
    }

    async function handleDemoLogin(account: DemoAccount) {
        if (isBusy) return;

        setDemoRoleLoading(account.role);

        try {
            await signIn({
                email: account.email,
                password: account.password,
            });
        } finally {
            setDemoRoleLoading(null);
        }
    }

    const inputClassName =
        "h-11 w-full min-w-0 rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-colors focus-visible:border-teal-400/80 focus-visible:ring-2 focus-visible:ring-teal-400/30 disabled:cursor-not-allowed disabled:opacity-60";

    const labelClassName =
        "text-xs font-semibold uppercase tracking-wider text-slate-300";

    return (
        <div className="w-full min-w-0 space-y-6">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="min-w-0 space-y-5"
            >
                {/* Email */}
                <div className="min-w-0 space-y-2">
                    <Label htmlFor="email" className={labelClassName}>
                        Email
                    </Label>

                    <div className="relative min-w-0">
                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="name@company.com"
                            disabled={isBusy}
                            aria-invalid={Boolean(
                                form.formState.errors.email,
                            )}
                            aria-describedby={
                                form.formState.errors.email
                                    ? "email-error"
                                    : undefined
                            }
                            {...form.register("email")}
                            className={inputClassName}
                        />
                    </div>

                    {form.formState.errors.email && (
                        <p
                            id="email-error"
                            role="alert"
                            className="flex min-w-0 items-start gap-1.5 break-words text-xs font-medium leading-5 text-rose-400"
                        >
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            <span className="min-w-0">
                                {form.formState.errors.email.message}
                            </span>
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="min-w-0 space-y-2">
                    <Label htmlFor="password" className={labelClassName}>
                        Password
                    </Label>

                    <div className="relative min-w-0">
                        <Lock
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            disabled={isBusy}
                            aria-invalid={Boolean(
                                form.formState.errors.password,
                            )}
                            aria-describedby={
                                form.formState.errors.password
                                    ? "password-error"
                                    : undefined
                            }
                            {...form.register("password")}
                            className={`${inputClassName} pr-12`}
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
                            disabled={isBusy}
                            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                            id="password-error"
                            role="alert"
                            className="flex min-w-0 items-start gap-1.5 break-words text-xs font-medium leading-5 text-rose-400"
                        >
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            <span className="min-w-0">
                                {form.formState.errors.password.message}
                            </span>
                        </p>
                    )}
                </div>

                {/* Standard sign-in */}
                <Button
                    type="submit"
                    disabled={isBusy}
                    className="min-h-11 w-full min-w-0 whitespace-normal rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-colors hover:bg-teal-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none"
                >
                    {form.formState.isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2
                                aria-hidden="true"
                                className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
                            />
                            Signing in...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            {/* Demo accounts */}
            <section
                aria-labelledby="demo-login-heading"
                className="min-w-0 space-y-3"
            >
                <div className="space-y-1 text-center">
                    <h2
                        id="demo-login-heading"
                        className="text-sm font-semibold text-slate-100"
                    >
                        Explore Servexa
                    </h2>
                    <p className="text-xs leading-5 text-slate-400">
                        Try the platform using a demo account.
                    </p>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {DEMO_ACCOUNTS.map((account) => {
                        const Icon = account.icon;
                        const isLoading =
                            demoRoleLoading === account.role;

                        return (
                            <Button
                                key={account.role}
                                type="button"
                                variant="outline"
                                disabled={isBusy}
                                onClick={() => handleDemoLogin(account)}
                                aria-label={`Sign in with demo ${account.label} account`}
                                className="h-auto min-h-11 w-full min-w-0 justify-center gap-2 whitespace-normal break-words rounded-xl border-white/10 bg-slate-950/40 px-3 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-200 focus-visible:ring-2 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                            >
                                {isLoading ? (
                                    <Loader2
                                        aria-hidden="true"
                                        className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
                                    />
                                ) : (
                                    <Icon
                                        aria-hidden="true"
                                        className="size-4 shrink-0"
                                    />
                                )}

                                <span className="min-w-0">
                                    {isLoading
                                        ? "Signing in..."
                                        : `Demo ${account.label}`}
                                </span>
                            </Button>
                        );
                    })}
                </div>
            </section>

            {/* Google sign-in */}
            <div className="min-w-0 space-y-5">
                <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-white/10" />
                    <span className="absolute whitespace-nowrap bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Or continue with
                    </span>
                </div>

                <div className="min-w-0">
                    <GoogleLoginButton />
                </div>
            </div>
        </div>
    );
}