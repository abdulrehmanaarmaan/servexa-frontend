import TechnicianNotificationsClient from "@/components/technician/TechnicianNotificationsClient";
import { getNotificationsServer } from "@/services/notification.server.service";

export default async function TechnicianNotificationsPage() {
    const notifications = await getNotificationsServer({
        page: 1,
        limit: 20,
    });

    return (
        <TechnicianNotificationsClient
            initialData={notifications}
        />
    );
}