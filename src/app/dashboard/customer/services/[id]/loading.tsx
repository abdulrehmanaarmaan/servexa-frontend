import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <Skeleton className="h-9 w-36 rounded-xl bg-slate-800" />

            <Card className="overflow-hidden border-white/10 bg-slate-900/80 backdrop-blur-xl">
                <Skeleton className="aspect-[16/9] w-full max-h-96 rounded-none bg-slate-800" />

                <CardHeader className="space-y-4 border-b border-white/10 p-5 sm:p-6 lg:p-8">
                    <Skeleton className="h-6 w-28 rounded-full bg-slate-800" />
                    <Skeleton className="h-10 w-2/3 rounded-2xl bg-slate-800" />
                    <Skeleton className="h-5 w-full max-w-2xl rounded-xl bg-slate-800/80" />
                </CardHeader>

                <CardContent className="space-y-6 p-5 sm:p-6 lg:p-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {["one", "two", "three"].map((id) => (
                            <Skeleton
                                key={id}
                                className="h-20 rounded-2xl bg-slate-950/80"
                            />
                        ))}
                    </div>

                    <Skeleton className="h-36 rounded-2xl bg-slate-950/80" />
                    <Skeleton className="h-40 rounded-2xl bg-slate-950/80" />
                </CardContent>
            </Card>
        </div>
    );
}