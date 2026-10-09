import { cookies } from "next/headers";

import AppShell from "@/components/dashboard/AppShell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();

    const token =
        cookieStore.get("accessToken");

    /*
     * The proxy protects dashboard routes.
     *
     * Keep this server-side check as a defensive
     * guard, but do not create a second login
     * redirect here because the proxy already
     * preserves callbackUrl.
     */
    if (!token) {
        return null;
    }

    return (
        <AppShell>
            {children}
        </AppShell>
    );
}