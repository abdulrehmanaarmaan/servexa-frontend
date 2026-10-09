import AdminRequestDetailsClient from "@/components/admin/AdminRequestDetailsClient";

interface AdminRequestDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminRequestDetailsPage({
  params,
}: AdminRequestDetailsPageProps) {
  const { id } = await params;

  return <AdminRequestDetailsClient requestId={id} />;
}