import type { Metadata } from "next";
import {
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Servexa and how it simplifies field service management.",
};

const features = [
  {
    title: "Service Management",
    description:
      "Organize service offerings and make them easier for customers to discover and request.",
    icon: Wrench,
  },
  {
    title: "Work Order Tracking",
    description:
      "Keep service work organized from request creation through assignment and completion.",
    icon: ClipboardCheck,
  },
  {
    title: "Technician Coordination",
    description:
      "Help administrators manage technicians, assignments, and availability from one platform.",
    icon: Users,
  },
  {
    title: "Secure Payments",
    description:
      "Manage invoices and customer payments through an integrated payment workflow.",
    icon: CreditCard,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950 pb-20">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.1),transparent_65%)]" />
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
                    <div className="max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                            About Servexa
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                            A simpler way to manage field services.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                            Servexa brings service management, customer requests,
                            technician coordination, work orders, invoices, and payments
                            together in one platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="border-b border-white/10 bg-slate-950/40 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div>
                            <div className="flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                                <ShieldCheck className="size-6" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Built around the complete service lifecycle
                            </h2>
                        </div>

                        <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                            <p>
                                Field service operations often involve several connected
                                activities: customers need to request services, administrators
                                need to coordinate those requests, technicians need clear
                                assignments, and completed work eventually leads to invoicing
                                and payment.
                            </p>

                            <p>
                                Servexa brings those workflows together so each role can work
                                from the information relevant to them.
                            </p>

                            <p>
                                The platform is designed around three primary roles:
                                customers, technicians, and administrators.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                        What Servexa manages
                    </div>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Everything connected in one workflow
                    </h2>
                </div>

                {features.length === 0 ? (
                    /* Empty State */
                    <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-6 py-20 text-center shadow-xl backdrop-blur-xl">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400 shadow-inner">
                            <Wrench className="size-6" />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-white sm:text-xl">
                            No features available
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                            There are currently no platform features listed. Please check back later.
                        </p>

                        <div className="mt-6">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                            >
                                Return home
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Features Grid */
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-teal-500/5 sm:p-7"
                                >
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />

                                    <div className="flex size-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
                                        <Icon className="size-5" />
                                    </div>

                                    <h3 className="mt-6 text-base font-bold text-white transition-colors group-hover:text-teal-300 sm:text-lg">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
  );
}