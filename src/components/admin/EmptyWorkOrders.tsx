import {
  ClipboardList,
} from "lucide-react";

export default function EmptyWorkOrders() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-900/40 px-4 py-12 text-center backdrop-blur-xl shadow-xl sm:px-6 sm:py-16">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 ring-1 ring-teal-400/20 shadow-inner sm:size-16">
        <ClipboardList className="size-7 text-teal-400 sm:size-8" />
      </div>

      <h3 className="text-base font-bold text-white sm:text-xl">
        No work orders found
      </h3>

      <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
        There are no work orders matching the current filter parameters or search queries.
      </p>
    </div>
  );
}