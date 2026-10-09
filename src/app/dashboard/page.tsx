import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const role =
    cookieStore.get(
      "servexa_role"
    )?.value;

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (role === "TECHNICIAN") {
    redirect("/dashboard/technician");
  }

  redirect("/dashboard/customer");
}