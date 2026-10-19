import Link from "next/link";
import {
  ArrowDown,
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
  CircleHelp,
  Clock3,
  Workflow,
  Eye,
  LockKeyhole,
  RefreshCw,
  BadgeCheck,
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
      "The request moves into the operational workflow where service work can be scheduled and managed.",
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
      "The completed service can be invoiced and the customer can complete the payment.",
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
      "Coordinate services, work orders, technicians, invoices, and overall operations.",
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

const operationalBenefits = [
  {
    icon: Workflow,
    title: "Connected workflows",
    text: "Keep service requests, work orders, assignments, and payments connected.",
  },
  {
    icon: Eye,
    title: "Clear status visibility",
    text: "Follow the progress of service work through its operational lifecycle.",
  },
  {
    icon: Clock3,
    title: "Organized scheduling",
    text: "Coordinate service windows and assigned work with clearer responsibilities.",
  },
];

const experienceHighlights = [
  {
    icon: RefreshCw,
    title: "A defined process",
    description:
      "Move from a customer request to work coordination, completion, and invoicing through an organized workflow.",
  },
  {
    icon: Users,
    title: "Responsibilities by role",
    description:
      "Give customers, technicians, and administrators workflows tailored to their responsibilities.",
  },
  {
    icon: BadgeCheck,
    title: "Traceable operations",
    description:
      "Keep important service information and work statuses available to the people responsible for each task.",
  },
];

const securityPrinciples = [
  {
    title: "Role-based access",
    description:
      "Customer, technician, and administrator experiences are organized around their respective responsibilities.",
  },
  {
    title: "Protected operations",
    description:
      "Backend authorization should validate access before allowing sensitive operational actions.",
  },
  {
    title: "Payment workflow",
    description:
      "Connect invoice payment activity to the platform's integrated payment process.",
  },
];

const faqs = [
  {
    question: "What is Servexa?",
    answer:
      "Servexa is a field service management platform designed to connect customers, technicians, and administrators through service requests, work orders, scheduling, invoices, and payments.",
  },
  {
    question: "How do I request a service?",
    answer:
      "Explore the available services, open the service you need, and follow the request process. Sign in when authentication is required.",
  },
  {
    question: "Can I track my service request?",
    answer:
      "Customers can use their dashboard to review service requests and the associated work-order progress available to their account.",
  },
  {
    question: "Who assigns technicians to jobs?",
    answer:
      "Administrators coordinate technician assignments and manage the work-order workflow.",
  },
  {
    question: "How are service payments handled?",
    answer:
      "Servexa connects service invoices with its integrated bKash payment workflow where payment is available for the invoice.",
  },
];

const buttonBase =
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]";

const outlineButton = `${buttonBase} border border-white/10 bg-slate-900/80 px-4 text-white shadow-sm backdrop-blur-xl hover:border-white/20 hover:bg-slate-800`;

const primaryButton = `${buttonBase} border border-teal-400/30 bg-teal-400 px-5 text-slate-950 shadow-md shadow-teal-500/10 hover:bg-teal-300`;

interface CurrentUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  isActive: boolean;
}

function getDashboardPath(role: CurrentUser["role"]) {
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

  const dashboardPath = currentUser ? getDashboardPath(currentUser.role) : null;

  const primaryHref = dashboardPath ?? "/auth/login";
  const primaryLabel = currentUser ? "Open dashboard" : "Sign in";

  return (
    <main className="overflow-hidden bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* 1. Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative h-[70svh] max-h-[70svh] min-h-0 overflow-hidden border-b border-white/10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(45,212,191,0.16),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-32 top-10 size-80 rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 size-80 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="grid w-full items-center gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-300 backdrop-blur-md sm:px-4 sm:text-xs">
                <ShieldCheck className="size-3.5 text-teal-400 sm:size-4" />
                Field service management
              </div>

              <h1
                id="hero-title"
                className="mt-4 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                From service request to{" "}
                <span className="bg-linear-to-r from-teal-200 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  completed work.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-xs leading-relaxed text-slate-400 sm:mt-5 sm:text-sm lg:text-base">
                Servexa connects customers, technicians, and administrators in
                one organized workflow for managing field services, work orders,
                scheduling, invoices, and payments.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                <Link href={primaryHref} className={primaryButton}>
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </Link>

                <Link href="/services" className={outlineButton}>
                  Explore services
                </Link>
              </div>

              <Link
                href="#capabilities"
                className="mt-5 inline-flex items-center gap-2 rounded-lg py-1 text-xs font-semibold text-slate-400 transition-colors hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:mt-6 sm:text-sm"
              >
                Discover what you can manage
                <ArrowDown className="size-4 animate-bounce text-teal-400" />
              </Link>
            </div>

            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative mx-auto max-w-md rounded-2xl border border-white/10 bg-slate-900/85 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400/80" />
                    <span className="size-2.5 rounded-full bg-amber-400/80" />
                    <span className="size-2.5 rounded-full bg-emerald-400/80" />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Service workflow
                  </span>
                </div>

                <div className="space-y-3">
                  {workflowSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isFirst = index === 0;

                    return (
                      <div
                        key={step.number}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                          isFirst
                            ? "border-teal-500/30 bg-teal-500/10"
                            : "border-white/10 bg-slate-950/60"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                              isFirst
                                ? "bg-teal-400/10 text-teal-300"
                                : "bg-white/5 text-slate-400"
                            }`}
                          >
                            <Icon className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-100">
                              {step.title}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-500">
                              Step {step.number}
                            </p>
                          </div>
                        </div>

                        {isFirst && (
                          <span className="shrink-0 rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-1 text-[10px] font-semibold text-teal-300">
                            Start
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-50" />
                    <span className="relative inline-flex size-2 rounded-full bg-teal-400" />
                  </span>
                  One connected operational workflow
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Capabilities */}
      <section
        id="capabilities"
        aria-labelledby="capabilities-title"
        className="scroll-mt-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              One operational platform
            </p>

            <h2
              id="capabilities-title"
              className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Everything needed to manage field service operations.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Bring the major stages of service delivery together instead of
              managing disconnected workflows.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  key={capability.title}
                  className="group rounded-2xl border border-white/10 bg-slate-950/80 p-6 transition-all hover:border-teal-500/30 hover:bg-slate-900/80"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white transition-colors group-hover:text-teal-300 sm:text-lg">
                    {capability.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Workflow */}
      <section
        id="workflow"
        aria-labelledby="workflow-title"
        className="bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              How it works
            </p>

            <h2
              id="workflow-title"
              className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              A clear workflow from request to resolution.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Each role has a defined responsibility throughout the work-order
              lifecycle.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5">
            {workflowSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition-colors hover:border-teal-500/30 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-teal-400">
                      {step.number}
                    </span>

                    <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-slate-300">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Roles */}
      <section
        id="roles"
        aria-labelledby="roles-title"
        className="border-y border-white/10 bg-slate-900/60 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              Built around three roles
            </p>

            <h2
              id="roles-title"
              className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              The right tools for every team member.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Keep customer activity, technician work, and administrative
              coordination organized by role.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <article
                  key={role.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 transition-colors hover:border-teal-500/30 sm:p-7"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-white">
                    {role.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {role.description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Service categories */}
      <section
        id="services"
        aria-labelledby="services-title"
        className="bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
                Explore services
              </p>

              <h2
                id="services-title"
                className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
              >
                Find the service you need.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                Browse service categories and find the right starting point for
                your request.
              </p>
            </div>

            <Link href="/services" className={outlineButton}>
              View all services
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <Link
                key={category}
                href={`/services?search=${encodeURIComponent(category)}`}
                className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition-all hover:border-teal-500/30 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                      <Wrench className="size-4" />
                    </div>

                    <span className="text-sm font-bold text-slate-200 transition-colors group-hover:text-teal-300 sm:text-base">
                      {category}
                    </span>
                  </div>

                  <ArrowRight className="size-4 shrink-0 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-teal-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Operational visibility */}
      <section
        id="visibility"
        aria-labelledby="visibility-title"
        className="border-y border-white/10 bg-slate-900/60 backdrop-blur-xl"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              Operational visibility
            </p>

            <h2
              id="visibility-title"
              className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Keep every stage of service delivery visible.
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
              From the initial request to technician assignment, work-order
              progress, invoicing, and payment, Servexa brings the workflow
              together.
            </p>

            <Link href={primaryHref} className={`${primaryButton} mt-7`}>
              {currentUser ? "Go to your dashboard" : "Get started"}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {operationalBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/80 p-5 transition-colors hover:border-teal-500/30"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      {benefit.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {benefit.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Service experience highlights */}
      <section
        id="experience"
        aria-labelledby="experience-title"
        className="bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
              Designed for coordination
            </p>

            <h2
              id="experience-title"
              className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Less fragmentation. A more organized service process.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              Keep service information, operational responsibilities, and
              progress connected from one stage to the next.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
            {experienceHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <article
                  key={highlight.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 transition-all hover:-translate-y-1 hover:border-teal-500/30 sm:p-7"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {highlight.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {highlight.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Security and accountability */}
      <section
        id="security"
        aria-labelledby="security-title"
        className="border-y border-white/10 bg-slate-900/60 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
                Security and accountability
              </p>

              <h2
                id="security-title"
                className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl"
              >
                Access and actions should match each role.
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                Service operations involve customer information, assignments,
                invoices, and payment activity. Access controls and backend
                authorization are important parts of a reliable workflow.
              </p>
            </div>

            <div className="space-y-4">
              {securityPrinciples.map((principle, index) => (
                <article
                  key={principle.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/80 p-5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
                    {index === 0 ? (
                      <Users className="size-5" />
                    ) : index === 1 ? (
                      <LockKeyhole className="size-5" />
                    ) : (
                      <CreditCard className="size-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      {principle.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {principle.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently asked questions */}
      <section id="faq" aria-labelledby="faq-title" className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
              <CircleHelp className="size-5" />
            </div>

            <h2
              id="faq-title"
              className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Frequently asked questions
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
              A few helpful details about using Servexa.
            </p>
          </div>

          <div className="mt-9 space-y-3 sm:mt-10">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 open:border-teal-500/30 sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white marker:hidden sm:text-base">
                  <span>{faq.question}</span>

                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 text-teal-400 transition-transform group-open:rotate-45">
                    <span aria-hidden="true">+</span>
                  </span>
                </summary>

                <p className="mt-4 max-w-3xl border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final call to action */}
      <section
        id="get-started"
        aria-labelledby="cta-title"
        className="border-t border-white/10 bg-slate-900/60"
      >
        <div className="relative mx-auto max-w-5xl overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-400">
              <Wrench className="size-6" />
            </div>

            <h2
              id="cta-title"
              className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              Ready to manage your service workflow?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Bring service requests, work orders, technicians, invoices, and
              payments together with Servexa.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={dashboardPath ?? "/auth/register"}
                className={primaryButton}
              >
                {currentUser ? "Open dashboard" : "Create your account"}
                <ArrowRight className="size-4" />
              </Link>

              <Link href="/services" className={outlineButton}>
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
