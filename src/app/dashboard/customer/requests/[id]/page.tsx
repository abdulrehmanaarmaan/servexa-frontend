import CustomerRequestDetailsClient from "@/components/customer/CustomerRequestDetailsClient";
import { serviceRequestServerService } from "@/services/request.server.service";
import { notFound } from "next/navigation";

interface CustomerRequestDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CustomerRequestDetailsPage({
    params,
}: CustomerRequestDetailsPageProps) {
    const { id } = await params;

    try {
        const request =
            await serviceRequestServerService.getById(id);

        if (!request) {
            notFound();
        }

        return (
            <CustomerRequestDetailsClient
                initialRequest={request}
            />
        );
    } catch (error) {
        console.error(
            "Failed to load customer service request:",
            error,
        );

        notFound();
    }
}