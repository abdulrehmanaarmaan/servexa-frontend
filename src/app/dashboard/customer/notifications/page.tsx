import { getNotificationsServer } from "@/services/notification.server.service";
import CustomerNotificationsClient from "../../../../components/customer/CustomerNotificationsClient";

export default async function CustomerNotificationsPage() {
    const notifications = await getNotificationsServer({
        page: 1,
        limit: 20,
    });

    return (
        <CustomerNotificationsClient
            initialData={notifications}
        />
    );
}