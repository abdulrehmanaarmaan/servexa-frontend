import { Skeleton } from "../ui/skeleton";

export default function ServiceTableSkeleton() {
  return (
    <div className="divide-y divide-white/5">
      {[
        "skeleton-1",
        "skeleton-2",
        "skeleton-3",
        "skeleton-4",
        "skeleton-5",
      ].map((id) => (
        <div key={id} className="flex items-center justify-between p-4 sm:px-6 sm:py-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 bg-slate-800 sm:w-48" />
            <Skeleton className="h-3 w-52 bg-slate-800/60 sm:w-72" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="hidden h-4 w-16 bg-slate-800 sm:block" />
            <Skeleton className="h-5 w-14 bg-slate-800" />
            <Skeleton className="hidden h-8 w-24 bg-slate-800 sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}