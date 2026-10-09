import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Servexa field service management.",
};

const faqs = [
  {
    question: "What is Servexa?",
    answer:
      "Servexa is a field service management platform for managing services, customer requests, technicians, work orders, invoices, and payments.",
  },
  {
    question: "Who can use Servexa?",
    answer:
      "Servexa supports three primary roles: customers, technicians, and administrators. Each role receives access to the workflows relevant to them.",
  },
  {
    question: "How do customers request a service?",
    answer:
      "Customers can browse available services and submit service requests from their dashboard.",
  },
  {
    question: "How are technicians assigned to work?",
    answer:
      "Administrators can manage work orders and assign available technicians to service work.",
  },
  {
    question: "Can technicians manage their availability?",
    answer:
      "Yes. Technicians have an availability workflow where they can manage their available schedule.",
  },
  {
    question: "How does payment work?",
    answer:
      "Customers can pay eligible invoices through the payment workflow available from their dashboard.",
  },
  {
    question: "Can customers track their requests?",
    answer:
      "Yes. Customers can view their service requests and follow their work-order and invoice activity from their dashboard.",
  },
  {
    question: "Does Servexa have different user roles?",
    answer:
      "Yes. The platform supports Customer, Technician, and Admin roles with role-based access to different workflows.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.1),transparent_65%)]" />
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                            FAQ
                        </div>

                        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Frequently asked questions
                        </h1>

                        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                            Learn how the main Servexa workflows fit together.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
                {faqs.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-6 py-20 text-center shadow-xl backdrop-blur-xl">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400 shadow-inner">
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-white sm:text-xl">
                            No questions available
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                            There are currently no frequently asked questions published. Please check back later or contact support if you need immediate assistance.
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
                    /* FAQs List / Accordion */
                    <div className="flex flex-col gap-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={faq.question}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-teal-400/40 hover:shadow-teal-500/5 open:border-teal-400/30"
                                open={index === 0} // Optional: keeps the first FAQ open by default for immediate engagement
                            >
                                <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 select-none sm:p-7 [&::-webkit-details-marker]:hidden">
                                    <h2 className="text-base font-bold text-white transition-colors group-hover:text-teal-300">
                                        {faq.question}
                                    </h2>
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:border-teal-400/30 group-open:bg-teal-400/10 group-open:text-teal-300">
                                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>

                                <div className="px-6 pb-6 pt-0 sm:px-7 sm:pb-7">
                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-sm leading-relaxed text-slate-300">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                )}
            </section>
        </main>
  );
}