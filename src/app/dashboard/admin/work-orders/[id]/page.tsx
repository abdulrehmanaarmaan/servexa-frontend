import { notFound } from "next/navigation";

import { workOrderServerService } from "@/services/work-order.server.service";
import WorkOrderDetailsClient from "@/components/admin/WorkOrderDetailsClient";

interface WorkOrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function WorkOrderDetailsPage({
    params,
}: WorkOrderDetailsPageProps) {
    const { id } = await params;

    try {
        const workOrder =
            await workOrderServerService.getById(id);

        if (!workOrder) {
            notFound();
        }

        return (
            <WorkOrderDetailsClient
                initialWorkOrder={workOrder}
            />
        );
    } catch (error) {
        console.error(
            "Failed to load work order:",
            error,
        );

        notFound();
    }
}