import {
  Skeleton,
} from "@/components/ui/skeleton";

const skeletonRows = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
];

export default function WorkOrderTableSkeleton() {
  return (
    <div className="space-y-3">
      {skeletonRows.map((id) => (
        <div
          key={`work-order-skeleton-${id}`}
          className="rounded-xl border border-white/10 bg-slate-900 p-4"
        >
          <div className="grid gap-4 md:grid-cols-6">
            <Skeleton className="h-5 w-28 bg-slate-800" />
            <Skeleton className="h-5 w-32 bg-slate-800" />
            <Skeleton className="h-5 w-28 bg-slate-800" />
            <Skeleton className="h-5 w-24 bg-slate-800" />
            <Skeleton className="h-5 w-24 bg-slate-800" />
            <Skeleton className="h-9 w-20 bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}