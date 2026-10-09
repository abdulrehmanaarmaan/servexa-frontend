"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";
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

import { registerSchema } from "@/lib/validation";
import { GoogleLoginButton } from "./GoogleLoginButton";

type Values = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  async function onSubmit(values: Values) {
    try {
        await authService.register(values);

        toast.success(
            "Account created. Please sign in.",
        );

        const callbackUrl =
            searchParams.get(
                "callbackUrl",
            );

        if (
            callbackUrl &&
            callbackUrl.startsWith("/") &&
            !callbackUrl.startsWith("//")
        ) {
            router.replace(
                `/auth/login?callbackUrl=${encodeURIComponent(
                    callbackUrl,
                )}`,
            );
        } else {
            router.replace(
                "/auth/login",
            );
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
    <div className="space-y-6">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Name Field */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Name
          </Label>

          <div className="relative rounded-xl transition-all focus-within:ring-2 focus-within:ring-teal-400/50">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User className="size-4" />
            </div>

            <Input
              id="name"
              placeholder="John Doe"
              {...form.register("name")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
            />
          </div>

          {form.formState.errors.name && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{form.formState.errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
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
              {...form.register("email")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
            />
          </div>

          {form.formState.errors.email && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{form.formState.errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Phone{" "}
            <span className="font-normal normal-case tracking-normal text-slate-500">
              (optional)
            </span>
          </Label>

          <div className="relative rounded-xl transition-all focus-within:ring-2 focus-within:ring-teal-400/50">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Phone className="size-4" />
            </div>

            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXXXXXXXX"
              {...form.register("phone")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
            />
          </div>

          {form.formState.errors.phone && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{form.formState.errors.phone.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
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
              placeholder="••••••••"
              {...form.register("password")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 pl-10 pr-11 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:outline-none focus:ring-0"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
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

          {form.formState.errors.password && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-400">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{form.formState.errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-xl bg-teal-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 hover:shadow-teal-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-slate-950" />
              <span>Creating account...</span>
            </div>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Visual Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-white/10" />

        <span className="absolute bg-slate-900/90 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Or continue with
        </span>
      </div>

      {/* Google Login */}
      <GoogleLoginButton />
    </div>
  );
}