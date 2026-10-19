import Link from "next/link";
import { notFound } from "next/navigation";
import {
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ServiceImage from "@/components/shared/ServiceImage";
import { cn } from "@/lib/utils";

interface Service {
    id: string;
    name: string;
    description: string | null;
    basePrice: string | number | null;
    imageUrl: string | null;
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
        throw new Error(payload.message || "Unable to load service details.");
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

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
            {/* Breadcrumb / Back Navigation */}
            <div>
                <Link
                    href="/dashboard/customer/services"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "group h-9 px-2.5 text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-[0.98]",
                    )}
                >
                    <ArrowLeft className="mr-2 size-4 text-teal-400 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to services
                </Link>
            </div>

            {/* Main Service Card */}
            <Card className="overflow-hidden border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                <ServiceImage
                    src={service.imageUrl}
                    alt={service.name}
                    priority
                    sizes="(min-width: 1152px) 1152px, 100vw"
                    className="aspect-[16/9] w-full max-h-96"
                />

                <CardHeader className="border-b border-white/10 p-5 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge
                                    className={cn(
                                        "rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md transition-colors",
                                        service.isActive
                                            ? "border-teal-400/30 bg-teal-400/10 text-teal-300"
                                            : "border-slate-500/30 bg-slate-500/10 text-slate-400",
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
                            <div className="shrink-0 rounded-2xl border border-teal-400/20 bg-teal-400/5 p-5 backdrop-blur-md sm:min-w-44 sm:text-right shadow-inner">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
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
                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-inner backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                                    <Wrench className="size-5 text-teal-400" />
                                </div>

                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                                        Service
                                    </p>

                                    <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                                        {service.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-inner backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                                    <Clock3 className="size-5 text-teal-400" />
                                </div>

                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                                        Availability
                                    </p>

                                    <p className="mt-0.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
                                        {service.isActive ? "Currently available" : "Unavailable"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-inner backdrop-blur-md sm:col-span-2 lg:col-span-1">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                                    <ShieldCheck className="size-5 text-teal-400" />
                                </div>

                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
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
                    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
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
                    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2.5">
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

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            {service.isActive ? (
                                <Link
                                    href={`/dashboard/customer/requests/new?serviceId=${service.id}`}
                                    className={cn(
                                        buttonVariants({ variant: "default" }),
                                        "h-11 w-full rounded-2xl bg-teal-400 font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98] sm:h-11 sm:w-auto sm:px-6",
                                    )}
                                >
                                    <CalendarDays className="mr-2 size-4" />
                                    Request this service
                                </Link>
                            ) : (
                                <Button
                                    disabled
                                    className="h-11 w-full rounded-2xl opacity-60 sm:h-11 sm:w-auto sm:px-6"
                                >
                                    Service unavailable
                                </Button>
                            )}

                            <Link
                                href="/dashboard/customer/services"
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-11 w-full rounded-2xl border-white/10 bg-slate-900 text-slate-200 transition-all hover:bg-slate-800 hover:text-white active:scale-[0.98] sm:h-11 sm:w-auto sm:px-6",
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