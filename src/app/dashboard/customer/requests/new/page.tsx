import Link from "next/link";
import { ArrowLeft, ClipboardPlus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewServiceRequestForm from "@/components/customer/NewServiceRequestForm";

interface NewServiceRequestPageProps {
    searchParams: Promise<{
        serviceId?: string;
    }>;
}

export default async function NewServiceRequestPage({
    searchParams,
}: NewServiceRequestPageProps) {
    const { serviceId } = await searchParams;

    return (
        <div className="mx-auto w-full max-w-4xl space-y-8 pb-16 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
            {/* Page Header */}
            <div className="space-y-4">
                <Link
                    href="/dashboard/customer/requests"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "group h-9 w-fit px-2.5 text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-[0.98]"
                    )}
                >
                    <ArrowLeft className="mr-2 size-4 text-teal-400 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to requests
                </Link>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(45,212,191,0.08),transparent_50%)]" />

                    <div className="relative z-10 flex items-start gap-4 sm:items-center">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-400 shadow-inner">
                            <ClipboardPlus className="size-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-0.5 text-xs font-semibold text-teal-300 shadow-sm backdrop-blur-md mb-2">
                                Request Center
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                New Service Request
                            </h1>

                            <p className="mt-1 text-xs sm:text-sm text-slate-400">
                                Submit a request for one of Servexa&apos;s available services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Form */}
            <NewServiceRequestForm initialServiceId={serviceId ?? ""} />
        </div>
    );
}