import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur-xl" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "skeleton-1",
            "skeleton-2",
            "skeleton-3",
            "skeleton-4",
          ].map((id) => (
            <Skeleton
              key={id}
              className="h-32 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl"
            />
          ))}
        </div>

        <Skeleton className="h-96 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl" />
      </div>
    </main>
  );
}