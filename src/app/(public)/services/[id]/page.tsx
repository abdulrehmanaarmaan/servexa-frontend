import Link from "next/link";
import { notFound } from "next/navigation";

import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number | string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CurrentUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  isActive: boolean;
}

interface ServiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatPrice(price: number | string | null) {
  if (price === null) {
    return "Price on request";
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "long",
  }).format(new Date(date));
}

function getDashboardPath(
  role: CurrentUser["role"],
) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";

    case "TECHNICIAN":
      return "/dashboard/technician";

    case "CUSTOMER":
    default:
      return "/dashboard/customer";
  }
}

async function getCurrentUser() {
  try {
    return await serverApiFetch<CurrentUser>(endpoints.auth.me);
  } catch {
    return null;
  }
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;

  let service: Service;

  try {
    service = await serverApiFetch<Service>(
      endpoints.services.detail(id),
    );
  } catch {
    notFound();
  }

  if (!service) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role)
    : null;

  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Top Back Navigation Bar */}
      <section className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-teal-300"
          >
            <span>←</span> Back to services
          </Link>
        </div>
      </section>

      {/* Main Detail Section */}
      <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-emerald-400" />

          <div className="p-6 sm:p-10 lg:p-12">
            {/* Header Details */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div
                  className={`mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold backdrop-blur-md ${
                    service.isActive
                      ? "border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-sm"
                      : "border border-white/10 bg-slate-800 text-slate-400"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      service.isActive
                        ? "animate-pulse bg-teal-400"
                        : "bg-slate-500"
                    }`}
                  />

                  {service.isActive
                    ? "Available service"
                    : "Currently unavailable"}
                </div>

                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {service.name}
                </h1>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner backdrop-blur-md sm:min-w-48">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Base price
                </p>

                <p className="mt-1.5 text-xl font-black text-white">
                  {formatPrice(service.basePrice)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                About this service
              </h2>

              <div className="mt-4 max-w-3xl">
                {service.description ? (
                  <p className="whitespace-pre-line text-base leading-relaxed text-slate-300">
                    {service.description}
                  </p>
                ) : (
                  <p className="text-base italic text-slate-500">
                    No additional description is available for this
                    service.
                  </p>
                )}
              </div>
            </div>

            {/* Service Metadata Grid */}
            <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Service status
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-white">
                  <span
                    className={`size-2 rounded-full ${
                      service.isActive
                        ? "animate-pulse bg-teal-400"
                        : "bg-rose-400"
                    }`}
                  />

                  {service.isActive
                    ? "Active and available"
                    : "Currently unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Added to Servexa
                </p>

                <p className="mt-2 text-sm font-bold text-white">
                  {formatDate(service.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row">
              {service.isActive && (
                <>
                  {!currentUser ? (
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98]"
                    >
                      Sign in to request this service
                    </Link>
                  ) : currentUser.role === "CUSTOMER" ? (
                    <Link
                      href="/dashboard/customer/services"
                      className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98]"
                    >
                      Request this service
                    </Link>
                  ) : (
                    <Link
                      href={dashboardPath!}
                      className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98]"
                    >
                      Open dashboard
                    </Link>
                  )}
                </>
              )}

              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-950 px-6 py-3.5 text-sm font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
              >
                Browse other services
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}