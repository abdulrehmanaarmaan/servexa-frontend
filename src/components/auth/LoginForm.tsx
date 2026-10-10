
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

            const destination =
                callbackUrl ?? ROLE_DASHBOARDS[user.role];

            // A full navigation also refreshes server-side auth state.
            window.location.replace(destination);
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

    return (
        <div className="space-y-6">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                            autoComplete="email"
                            placeholder="name@company.com"
                            disabled={isBusy}
                            {...form.register("email")}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
                        />
                    </div>

                    {form.formState.errors.email && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>
                                {form.formState.errors.email.message}
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
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={isBusy}
                            {...form.register("password")}
                            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-11 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
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
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-200 disabled:opacity-50"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    {form.formState.errors.password && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
                            <AlertCircle className="size-3.5 shrink-0" />
                            <span>
                                {form.formState.errors.password.message}
                            </span>
                        </p>
                    )}
                </div>

                {/* Standard sign-in */}
                <Button
                    type="submit"
                    disabled={isBusy}
                    className="w-full rounded-xl bg-teal-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 hover:shadow-teal-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {form.formState.isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            Signing in...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            {/* One-click demo access: required by B7A7 */}
            <div className="space-y-3">
                <div className="space-y-1 text-center">
                    <p className="text-sm font-semibold text-slate-100">
                        Explore Servexa
                    </p>
                    <p className="text-xs leading-5 text-slate-400">
                        Try the platform using a demo account.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                                className="h-auto min-h-11 w-full justify-center gap-2 rounded-xl border-white/10 bg-slate-950/40 px-3 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 shrink-0 animate-spin" />
                                ) : (
                                    <Icon className="size-4 shrink-0" />
                                )}

                                <span>
                                    {isLoading
                                        ? "Signing in..."
                                        : `Demo ${account.label}`}
                                </span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Google sign-in */}
            <div className="space-y-5">
                <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-white/10" />
                    <span className="absolute bg-slate-900/90 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Or continue with
                    </span>
                </div>

                <GoogleLoginButton />
            </div>
        </div>
    );
}
