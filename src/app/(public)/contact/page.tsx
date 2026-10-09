import type { Metadata } from "next";
import { Clock3, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Servexa for support and service information.",
};

const contactOptions = [
  {
    title: "General Support",
    description:
      "For questions about using Servexa or understanding the platform workflows.",
    icon: MessageSquare,
  },
  {
    title: "Account Assistance",
    description:
      "Sign in to your account to access your requests, work orders, invoices, and payments.",
    icon: ShieldCheck,
  },
  {
    title: "Email Support",
    description:
      "Reach out to the Servexa support team through your configured support email.",
    icon: Mail,
  },
];

interface CurrentUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  isActive: boolean;
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

export default async function ContactPage() {
  const currentUser = await getCurrentUser();

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role)
    : null;

  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.1),transparent_65%)]" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
              Contact Servexa
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Need help with Servexa?
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg lg:text-xl">
              Find the right way to get help with your account or learn more
              about the platform.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {contactOptions.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-6 py-20 text-center shadow-xl backdrop-blur-xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400 shadow-inner">
              <MessageSquare className="size-6" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-white sm:text-xl">
              No contact options available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              There are currently no support options published. Please check
              back later or proceed to account assistance.
            </p>

            <div className="mt-6">
              {currentUser ? (
                <Link
                  href={dashboardPath!}
                  className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 active:scale-[0.98]"
                >
                  Go to dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 active:scale-[0.98]"
                >
                  Go to login
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Contact Cards Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contactOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-teal-500/5 sm:p-7"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                    <Icon className="size-5" />
                  </div>

                  <h2 className="mt-6 text-base font-bold text-white transition-colors group-hover:text-teal-300 sm:text-lg">
                    {option.title}
                  </h2>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {option.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {/* Account-Specific Help Callout */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
              <Clock3 className="size-5" />
            </div>

            <div className="flex-1">
              <h2 className="text-base font-bold text-white sm:text-lg">
                Looking for account-specific help?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                {currentUser
                  ? "Open your personalized Servexa dashboard to manage your service activity."
                  : "Sign in to access your personalized Servexa dashboard and manage your service activity."}
              </p>

              <div className="mt-5">
                {currentUser ? (
                  <Link
                    href={dashboardPath!}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98]"
                  >
                    <span>Go to dashboard</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98]"
                  >
                    <span>Go to login</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}