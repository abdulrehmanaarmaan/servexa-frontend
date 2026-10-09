import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { cookies } from "next/headers";

export const metadata = {
    title: "Unauthorized",
    description: "You do not have permission to access this page.",
};

export default async function  UnauthorizedPage() {

    const cookieStore = await cookies();
    
      const role =
        cookieStore.get(
          "servexa_role"
        )?.value;

    const dashboard = role === "ADMIN" ? "/dashboard/admin" : role === "TECHNICIAN" ? "/dashboard/technician" : "/dashboard/customer"

    return (
        <section className="flex min-h-[75vh] items-center justify-center px-4 py-16 bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
                {/* Decorative gradient highlight border top */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500" />
                
                {/* Background ambient glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.08),transparent_60%)]" />

                <div className="relative z-10">
                    <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 ring-1 ring-teal-400/20 shadow-inner">
                        <ShieldAlert
                            size={28}
                            aria-hidden="true"
                        />
                    </div>

                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-400 sm:text-sm">
                        403
                    </p>

                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Access Denied
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
                        You are signed in, but your account does not have permission
                        to access this page.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400 px-5 text-sm font-semibold text-slate-950 shadow-md shadow-teal-500/10 whitespace-nowrap transition-all hover:bg-teal-300 active:scale-[0.98] outline-none select-none"
                        >
                            Go Home
                        </Link>

                        <Link
                            href={dashboard}
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm font-semibold text-white shadow-sm backdrop-blur-xl whitespace-nowrap transition-all hover:bg-slate-800 hover:border-white/20 active:scale-[0.98] outline-none select-none"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}