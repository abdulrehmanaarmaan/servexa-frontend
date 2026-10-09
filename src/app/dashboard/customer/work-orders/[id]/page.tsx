import { notFound } from "next/navigation";

import { workOrderServerService } from "@/services/work-order.server.service";
import CustomerWorkOrderDetailsClient from "@/components/customer/CustomerWorkOrderDetailsClient";

interface CustomerWorkOrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CustomerWorkOrderDetailsPage({
    params,
}: CustomerWorkOrderDetailsPageProps) {
    const { id } = await params;

    try {
        const workOrder =
            await workOrderServerService.getById(id);

        if (!workOrder) {
            notFound();
        }

        return (
            <CustomerWorkOrderDetailsClient
                initialWorkOrder={workOrder}
            />
        );
    } catch (error) {
        console.error(
            "Failed to load customer work order:",
            error,
        );

        notFound();
    }
}