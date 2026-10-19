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
        <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center sm:p-12">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-400 shadow-inner">
                {hasSearch ? (
                    <Search className="size-8 text-slate-400" />
                ) : (
                    <Layers className="size-8 text-teal-400" />
                )}
            </div>

            <h3 className="mt-5 text-lg font-bold text-white sm:text-xl">
                {hasSearch ? "No services match your filters" : "No services created yet"}
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
                {hasSearch
                    ? "Try adjusting your search terms or status filters to find what you're looking for."
                    : "Create your first service to make it available for customers across Servexa."}
            </p>

            {!hasSearch && (
                <Button
                    onClick={onCreate}
                    className="mt-6 h-10 rounded-2xl bg-teal-400 font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:bg-teal-300 active:scale-[0.98] sm:h-10 sm:px-6"
                >
                    <Plus className="mr-2 size-4" />
                    Add Service
                </Button>
            )}
        </div>
    );
}