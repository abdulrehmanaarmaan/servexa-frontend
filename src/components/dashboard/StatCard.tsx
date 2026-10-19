import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <Card className="rounded-3xl border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-teal-400/30">
      <CardContent className="flex items-center justify-between p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-black text-white sm:text-3xl tabular-nums">
            {value}
          </p>
        </div>

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-inner">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}