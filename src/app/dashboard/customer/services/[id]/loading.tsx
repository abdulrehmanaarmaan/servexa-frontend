import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Skeleton className="h-5 w-32 bg-slate-800" />

      <Card className="border-white/10 bg-slate-900">
        <CardHeader className="space-y-4 border-b border-white/10 p-5 sm:p-6 lg:p-8">
          <Skeleton className="h-6 w-28 bg-slate-800" />
          <Skeleton className="h-10 w-2/3 bg-slate-800" />
          <Skeleton className="h-5 w-full max-w-2xl bg-slate-800" />
        </CardHeader>

        <CardContent className="space-y-6 p-5 sm:p-6 lg:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["one", "two", "three"].map((id) => (
              <Skeleton
                key={id}
                className="h-20 rounded-xl bg-slate-950"
              />
            ))}
          </div>

          <Skeleton className="h-36 rounded-xl bg-slate-950" />
          <Skeleton className="h-40 rounded-xl bg-slate-950" />
        </CardContent>
      </Card>
    </div>
  );
}