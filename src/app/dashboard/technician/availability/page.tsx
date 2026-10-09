import { serverApiFetch } from "@/lib/api-server";

import { endpoints } from "@/lib/endpoints";
import type { Availability } from "@/types/availability";
import AvailabilityManager from "@/components/technician/AvailabilityManager";
import { Clock } from "lucide-react";

export default async function TechnicianAvailabilityPage() {
    const availabilities =
        await serverApiFetch<Availability[]>(
            endpoints.availability.me,
        );

    return (
        <section className="space-y-6 text-slate-100">
            <div>
                <div className="flex items-center gap-2 text-teal-400">
                    <Clock className="size-4 sm:size-5" />
                    <span className="text-xs font-semibold tracking-wide sm:text-sm">
                        Schedule Management
                    </span>
                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Availability
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
                    Manage the time periods when you are available
                    for service jobs.
                </p>
            </div>

            <AvailabilityManager
                initialAvailabilities={availabilities}
            />
        </section>
    );
}