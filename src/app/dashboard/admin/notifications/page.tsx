import { getNotificationsServer } from "@/services/notification.server.service";
import AdminNotifications from "@/components/admin/AdminNotifications";

export default async function AdminNotificationsPage() {
    const initialData =
        await getNotificationsServer({
            page: 1,
            limit: 20,
        });

    return (
        <AdminNotifications
            initialData={initialData}
        />
    );
}