import AdminTechniciansClient from "@/components/admin/AdminTechniciansClient";
import { getAdminTechniciansServer } from "@/services/admin.server.service";

export default async function AdminTechniciansPage() {
    const technicians = await getAdminTechniciansServer();

    return (
        <AdminTechniciansClient
            initialTechnicians={technicians}
        />
    );
}