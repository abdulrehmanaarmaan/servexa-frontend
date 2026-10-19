import { Edit3, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import ServiceImage from "../shared/ServiceImage";
import { Service } from "@/types/service";
import { formatDate, formatPrice } from "@/lib/utils";

export default function ServiceMobileCard({
    service,
    onEdit,
    onToggle,
    onDelete,
    isToggling,
}: {
    service: Service;
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
    isToggling: boolean;
}) {
    return (
        <div className="space-y-4 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <ServiceImage
                        src={service.imageUrl}
                        alt={service.name}
                        sizes="64px"
                        className="size-16 shrink-0 rounded-2xl border border-white/10 shadow-sm"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white sm:text-base">
                            {service.name}
                        </p>

                        {service.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                                {service.description}
                            </p>
                        )}
                    </div>
                </div>

                <Badge
                    className={
                        service.isActive
                            ? "shrink-0 border-teal-400/30 bg-teal-400/10 text-teal-300 backdrop-blur-md"
                            : "shrink-0 border-slate-400/30 bg-slate-400/10 text-slate-400 backdrop-blur-md"
                    }
                >
                    {service.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-slate-950/80 p-3 shadow-inner">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Base price
                    </p>
                    <p className="mt-0.5 text-xs font-black text-teal-400 sm:text-sm">
                        {formatPrice(service.basePrice!)}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Created
                    </p>
                    <p className="mt-0.5 text-xs font-mono text-slate-300">
                        {formatDate(service.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="h-9 rounded-xl border-white/10 bg-slate-950 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    <Edit3 className="mr-1.5 size-3.5 text-teal-400" />
                    Edit
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={isToggling}
                    onClick={onToggle}
                    className="h-9 rounded-xl border-white/10 bg-slate-950 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    {isToggling ? (
                        <Loader2 className="mr-1.5 size-3.5 animate-spin text-teal-400" />
                    ) : service.isActive ? (
                        "Deactivate"
                    ) : (
                        "Activate"
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="h-9 rounded-xl border-rose-500/20 bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                >
                    <Trash2 className="mr-1.5 size-3.5" />
                    Delete
                </Button>
            </div>
        </div>
    );
}