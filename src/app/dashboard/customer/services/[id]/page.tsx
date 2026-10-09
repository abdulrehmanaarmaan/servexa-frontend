import Link from "next/link";
import { notFound } from "next/navigation";
import {
    AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: string | number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: Service;
}

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getService(id: string): Promise<Service | null> {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}/services/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load service details.");
  }

  const payload = (await response.json()) as ServiceResponse;

  if (!payload.success || !payload.data) {
    throw new Error(
      payload.message || "Unable to load service details."
    );
  }

  return payload.data;
}

export default async function CustomerServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params;

  const service = await getService(id);

  if (!service) {
    notFound();
  }

  const formattedPrice =
    service.basePrice !== null
      ? `৳${Number(service.basePrice).toLocaleString("en-BD", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : null;

    if (!service) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
        <div>
          <Link
            href="/dashboard/customer/services"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-9 px-2.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all active:scale-[0.98]"
            )}
          >
            <ArrowLeft className="mr-2 size-4 text-teal-400" />
            Back to services
          </Link>
        </div>

        <Card className="border-dashed border-white/15 bg-slate-900/40 backdrop-blur-xl shadow-xl">
          <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/30 shadow-inner shadow-amber-500/10 sm:size-16">
              <AlertTriangle className="size-7 text-amber-400 sm:size-8" />
            </div>

            <h2 className="text-base font-bold text-white sm:text-xl">
              Service Not Found
            </h2>

            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
              The requested service could not be located or may have been removed from our active catalog.
            </p>

            <Link
              href="/dashboard/customer/services"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "mt-6 h-9 bg-teal-400 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:bg-teal-300 active:scale-[0.98]"
              )}
            >
              <ArrowLeft className="mr-2 size-4" />
              Return to Catalog
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Breadcrumb / Back Navigation */}
      <div>
        <Link
          href="/dashboard/customer/services"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-9 px-2.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all active:scale-[0.98]"
          )}
        >
          <ArrowLeft className="mr-2 size-4 text-teal-400" />
          Back to services
        </Link>
      </div>

      {/* Main Service Card */}
      <Card className="overflow-hidden border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl">
        <CardHeader className="border-b border-white/10 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-semibold backdrop-blur-md transition-colors",
                    service.isActive
                      ? "border-teal-400/30 bg-teal-400/10 text-teal-300"
                      : "border-slate-500/30 bg-slate-500/10 text-slate-400"
                  )}
                >
                  {service.isActive ? (
                    <>
                      <CheckCircle2 className="mr-1.5 size-3.5" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1.5 size-3.5" />
                      Currently unavailable
                    </>
                  )}
                </Badge>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                {service.name}
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm lg:text-base">
                {service.description ||
                  "Professional service provided through Servexa."}
              </p>
            </div>

            {formattedPrice && (
              <div className="shrink-0 rounded-xl border border-teal-400/20 bg-teal-400/5 p-4 backdrop-blur-md sm:min-w-36 sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                  Starting price
                </p>

                <p className="mt-1 text-xl font-black text-teal-400 sm:text-2xl">
                  {formattedPrice}
                </p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 lg:p-8 space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                  <Wrench className="size-4 text-teal-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    Service
                  </p>

                  <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                    {service.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                  <Clock3 className="size-4 text-teal-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    Availability
                  </p>

                  <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                    {service.isActive ? "Currently available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md sm:col-span-2 lg:col-span-1">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-400/10">
                  <ShieldCheck className="size-4 text-teal-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    Servexa
                  </p>

                  <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                    Professional service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description Block */}
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-teal-400" />

              <h2 className="text-sm font-bold text-white sm:text-base">
                About this service
              </h2>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm sm:leading-7">
              {service.description ||
                "No additional description has been provided for this service."}
            </p>
          </div>

          {/* Request Information Box */}
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-teal-400" />

              <h2 className="text-sm font-bold text-white sm:text-base">
                Request this service
              </h2>
            </div>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              Submit a service request with your preferred schedule,
              service location, and any additional information the
              technician should know.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              {service.isActive ? (
                <Link
                  href={`/dashboard/customer/requests/new?serviceId=${service.id}`}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-10 w-full bg-teal-400 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-9 sm:w-auto"
                  )}
                >
                  <CalendarDays className="mr-2 size-4" />
                  Request this service
                </Link>
              ) : (
                <Button
                  disabled
                  className="h-10 w-full opacity-60 sm:h-9 sm:w-auto"
                >
                  Service unavailable
                </Button>
              )}

              <Link
                href="/dashboard/customer/services"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 w-full border-white/10 bg-slate-800 text-slate-200 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98] sm:h-9 sm:w-auto"
                )}
              >
                <ArrowLeft className="mr-2 size-4" />
                Browse services
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}