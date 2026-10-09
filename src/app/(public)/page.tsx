import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import { endpoints } from "@/lib/endpoints";
import { serverApiFetch } from "@/lib/api-server";

const capabilities = [
  {
    icon: ClipboardCheck,
    title: "Service Requests",
    description:
      "Customers can submit service requests with the information needed to start the operational workflow.",
  },
  {
    icon: Wrench,
    title: "Work Order Management",
    description:
      "Administrators can create, schedule, assign, and monitor work orders through their lifecycle.",
  },
  {
    icon: Users,
    title: "Technician Assignment",
    description:
      "Assign technicians to active work orders and keep service delivery organized from dispatch to completion.",
  },
  {
    icon: CalendarCheck,
    title: "Scheduling",
    description:
      "Manage scheduled service windows and keep technicians informed about upcoming work.",
  },
  {
    icon: FileText,
    title: "Invoices",
    description:
      "Generate and manage invoices associated with completed service work.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Customers can complete invoice payments through the integrated bKash payment workflow.",
  },
];

const workflowSteps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Request a service",
    description:
      "A customer selects a service and submits the required service request details.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Create a work order",
    description:
      "The request moves into the operational workflow where the service work can be scheduled and managed.",
  },
  {
    number: "03",
    icon: UserRound,
    title: "Assign a technician",
    description:
      "An administrator assigns an available technician to handle the work order.",
  },
  {
    number: "04",
    icon: Wrench,
    title: "Complete the work",
    description:
      "The technician manages the assigned job and updates its status through completion.",
  },
  {
    number: "05",
    icon: CreditCard,
    title: "Invoice and payment",
    description:
      "The completed service can be invoiced and the customer can complete the payment securely.",
  },
];

const roles = [
  {
    icon: UserRound,
    title: "Customer",
    description:
      "Request services, track work orders, view invoices, and complete payments.",
    points: [
      "Submit service requests",
      "Track service progress",
      "View invoices",
      "Make payments",
    ],
  },
  {
    icon: Wrench,
    title: "Technician",
    description:
      "Manage assigned work, update job progress, and complete field service operations.",
    points: [
      "View assigned jobs",
      "Manage availability",
      "Update work-order status",
      "Complete assigned work",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Administrator",
    description:
      "Coordinate services, work orders, technicians, invoices, and the overall operation.",
    points: [
      "Manage services",
      "Manage work orders",
      "Assign technicians",
      "Monitor operations",
    ],
  },
];

const serviceCategories = [
  "Home Maintenance",
  "Electrical Services",
  "Plumbing Services",
  "Cleaning Services",
  "Appliance Services",
  "General Repairs",
];

const buttonBase =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all outline-none select-none active:scale-[0.98]";

const outlineButton =
  `${buttonBase} border border-white/10 bg-slate-900/80 px-4 text-white shadow-sm backdrop-blur-xl hover:bg-slate-800 hover:border-white/20`;

const primaryButton =
  `${buttonBase} border border-teal-400/30 bg-teal-400 px-5 text-slate-950 shadow-md shadow-teal-500/10 hover:bg-teal-300`;

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

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role)
    : null;

  return (
    <main className="overflow-hidden bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[650px] bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.15),transparent_65%)]" />

        <div className="pointer-events-none absolute -right-40 top-20 -z-10 size-[420px] rounded-full bg-teal-500/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-300 backdrop-blur-md sm:text-sm">
                <ShieldCheck className="size-4 text-teal-400" />
                Field Service Management
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.08]">
                From service request to{" "}
                <span className="bg-linear-to-r from-teal-200 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  completed work.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Servexa connects customers, technicians, and administrators
                in one organized workflow for managing field services,
                work orders, scheduling, invoices, and payments.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {currentUser ? (
                  <Link href={dashboardPath!} className={primaryButton}>
                    Open dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <Link href="/auth/login" className={primaryButton}>
                    Open dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                )}

                <Link href="/services" className={outlineButton}>
                  Explore services
                </Link>
              </div>

              <div className="mt-10 grid gap-3 text-xs sm:grid-cols-2 sm:text-sm">
                {[
                  "Role-based operations",
                  "Work-order tracking",
                  "Technician assignment",
                  "Integrated payment workflow",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur-xl transition-all hover:border-teal-400/30"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-teal-400" />
                    <span className="font-medium text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-rose-400/80" />
                    <div className="size-2.5 rounded-full bg-amber-400/80" />
                    <div className="size-2.5 rounded-full bg-emerald-400/80" />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Service workflow
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: ClipboardCheck,
                      label: "Service request created",
                      role: "Customer",
                      active: true,
                    },
                    {
                      icon: FileText,
                      label: "Work order scheduled",
                      role: "Admin",
                    },
                    {
                      icon: UserRound,
                      label: "Technician assigned",
                      role: "Admin",
                    },
                    {
                      icon: Wrench,
                      label: "Job completed",
                      role: "Technician",
                    },
                    {
                      icon: CreditCard,
                      label: "Invoice payment",
                      role: "Customer",
                    },
                  ].map((step) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className={`flex items-center justify-between rounded-xl border p-3.5 backdrop-blur-md transition-all ${
                          step.active
                            ? "border-teal-500/30 bg-teal-500/10 text-white"
                            : "border-white/10 bg-slate-950/60 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`size-4 ${
                              step.active
                                ? "text-teal-400"
                                : "text-slate-400"
                            }`}
                          />

                          <span className="text-xs font-semibold sm:text-sm">
                            {step.label}
                          </span>
                        </div>

                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-400">
                          {step.role}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              One operational platform
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Everything needed to manage field service operations.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Servexa brings the major stages of service delivery together
              instead of requiring customers, technicians, and administrators
              to manage disconnected workflows.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <div
                  key={capability.title}
                  className="group rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl transition-all hover:border-teal-500/30 hover:bg-slate-900/80"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 ring-1 ring-teal-400/20 shadow-inner">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white sm:text-lg">
                    {capability.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A clear workflow from request to resolution.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Every role has a defined responsibility, keeping service
              delivery organized throughout the work-order lifecycle.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {workflowSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-teal-500/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-teal-400">
                      {step.number}
                    </span>

                    <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-slate-400">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="mt-6 text-sm font-bold text-white sm:text-base">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-y border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              Built around three roles
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Each team member gets the tools relevant to their work.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 p-7 backdrop-blur-xl transition-all hover:border-teal-500/30"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 ring-1 ring-teal-400/20 shadow-inner">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white sm:text-xl">
                    {role.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    {role.description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-3 text-xs font-medium text-slate-300 sm:text-sm"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-teal-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
                Services
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Find the service you need.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                Browse available services and start a request through the
                Servexa service workflow.
              </p>
            </div>

            <Link href="/services" className={outlineButton}>
              View all services
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <Link
                key={category}
                href={`/services?search=${encodeURIComponent(category)}`}
                className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl transition-all hover:border-teal-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                      <Wrench className="size-4" />
                    </div>

                    <span className="text-sm font-bold text-slate-200 sm:text-base">
                      {category}
                    </span>
                  </div>

                  <ArrowRight className="size-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-teal-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Operational Benefits */}
      <section className="border-y border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
                Operational visibility
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Keep every stage of service delivery visible.
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                From the initial request to technician assignment, work-order
                progress, invoicing, and payment, Servexa keeps the workflow
                connected.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                {[
                  {
                    icon: Zap,
                    title: "Clear status tracking",
                    text: "Follow work orders through their operational lifecycle.",
                  },
                  {
                    icon: MapPin,
                    title: "Service information",
                    text: "Keep service and address information connected to the work.",
                  },
                  {
                    icon: CreditCard,
                    title: "Payment visibility",
                    text: "Connect invoices with the integrated payment workflow.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl transition-all hover:border-teal-500/30"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                        <Icon className="size-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white sm:text-base">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex size-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    Role-based access
                  </h3>

                  <p className="text-xs text-slate-400">
                    Access based on operational responsibility
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 px-4 py-3">
                  <span className="text-sm font-medium text-slate-300">
                    Customer
                  </span>

                  <span className="text-xs font-semibold text-teal-400">
                    Service & payments
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 px-4 py-3">
                  <span className="text-sm font-medium text-slate-300">
                    Technician
                  </span>

                  <span className="text-xs font-semibold text-teal-400">
                    Assigned work
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 px-4 py-3">
                  <span className="text-sm font-medium text-slate-300">
                    Administrator
                  </span>

                  <span className="text-xs font-semibold text-teal-400">
                    Operations
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-teal-500/20 bg-teal-500/10 p-4 backdrop-blur-md">
                <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Each role works with the information and operations relevant
                  to its responsibilities, while protected backend APIs enforce
                  authorization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-400 ring-1 ring-teal-400/20 shadow-inner">
            <Wrench className="size-6" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ready to manage your service workflow?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Start with Servexa and keep service requests, work orders,
            technicians, invoices, and payments connected in one platform.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {currentUser ? (
              <Link href={dashboardPath!} className={primaryButton}>
                Open dashboard
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link href="/auth/register" className={primaryButton}>
                Create your account
                <ArrowRight className="size-4" />
              </Link>
            )}

            <Link href="/services" className={outlineButton}>
              Explore services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}