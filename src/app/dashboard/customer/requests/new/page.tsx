import Link from "next/link";
import { ArrowLeft, ClipboardPlus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewServiceRequestForm from "../../../../../components/customer/NewServiceRequestForm";

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
    <div className="mx-auto w-full max-w-5xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Page Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/customer/requests"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-9 w-fit px-2.5 text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-[0.98]"
          )}
        >
          <ArrowLeft className="mr-2 size-4 text-teal-400" />
          Back to requests
        </Link>

        <div>
          <div className="flex items-start gap-3.5 sm:items-center">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 shadow-inner shadow-teal-500/10">
              <ClipboardPlus className="size-5 text-teal-400 sm:size-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                New Service Request
              </h1>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
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