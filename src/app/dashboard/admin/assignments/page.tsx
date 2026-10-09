import { getAdminAssignmentWorkOrders } from "@/services/assignment.server";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";


export default async function AdminAssignmentsPage() {
  const workOrders = await getAdminAssignmentWorkOrders();

  return (
    <section className="space-y-6 text-slate-100">
      <div>
        <div className="flex items-center gap-2 text-teal-400">
          <ShieldCheck className="size-4 sm:size-5" />
          <span className="text-xs font-semibold tracking-wide sm:text-sm">
            Operations Management
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Assignments
        </h1>

        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
          Select a work order to manage technician assignments.
        </p>
      </div>

      {workOrders.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-slate-400 ring-1 ring-white/10 shadow-inner">
            <Users className="size-6 text-teal-400" />
          </div>

          <h2 className="mt-4 text-base font-bold text-white sm:text-lg">
            No work orders available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
            No work orders available for assignment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workOrders.map((workOrder) => (
            <Link
              key={workOrder.id}
              href={`/dashboard/admin/assignments/${workOrder.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-200 hover:border-teal-400/30 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-white transition-colors group-hover:text-teal-300 sm:text-lg">
                    {workOrder.title ?? "Work Order"}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span className="inline-block size-2 rounded-full bg-teal-400 animate-pulse" />
                    Status: <span className="text-slate-200">{workOrder.status}</span>
                  </p>
                </div>

                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors group-hover:border-teal-400/30 group-hover:bg-teal-400/10 group-hover:text-teal-300">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}