import { Layers, Plus, Search } from "lucide-react";
import { Button } from "../ui/button";

export default function EmptyServices({
  hasSearch,
  onCreate,
}: {
  hasSearch: boolean;
  onCreate: () => void;
}) {
  return (
   <div className="flex min-h-[300px] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 shadow-inner sm:size-16">
        {hasSearch ? (
          <Search className="size-7 text-slate-400 sm:size-8" />
        ) : (
          <Layers className="size-7 text-teal-400 sm:size-8" />
        )}
      </div>

      <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
        {hasSearch ? "No services match your filters" : "No services created yet"}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
        {hasSearch
          ? "Try adjusting your search terms or status filters to find what you're looking for."
          : "Create your first service to make it available for customers across Servexa."}
      </p>

      {!hasSearch && (
        <Button
          onClick={onCreate}
          className="mt-6 h-10 bg-teal-400 font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:bg-teal-300 active:scale-[0.98] sm:h-9"
        >
          <Plus className="mr-2 size-4" />
          Add Service
        </Button>
      )}
    </div>
  );
}