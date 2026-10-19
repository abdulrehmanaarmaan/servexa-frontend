import { Edit3, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import ServiceImage from "../shared/ServiceImage";
import { Service } from "@/types/service";
import { formatDate, formatPrice } from "@/lib/utils";

export default function ServiceTableRow({
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
        <tr className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
            <td className="px-6 py-4">
                <div className="flex max-w-md items-center gap-3.5">
                    <ServiceImage
                        src={service.imageUrl}
                        alt={service.name}
                        sizes="56px"
                        className="size-14 shrink-0 rounded-xl border border-white/10 shadow-sm"
                    />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                            {service.name}
                        </p>

                        {service.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                                {service.description}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 text-xs font-bold text-teal-400 sm:text-sm">
                {formatPrice(service.basePrice!)}
            </td>

            <td className="px-6 py-4">
                <Badge
                    className={
                        service.isActive
                            ? "border-teal-400/30 bg-teal-400/10 text-teal-300 backdrop-blur-md"
                            : "border-slate-400/30 bg-slate-400/10 text-slate-400 backdrop-blur-md"
                    }
                >
                    {service.isActive ? "Active" : "Inactive"}
                </Badge>
            </td>

            <td className="px-6 py-4 text-xs font-mono text-slate-400">
                {formatDate(service.createdAt)}
            </td>

            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="h-8 rounded-xl px-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                        <Edit3 className="mr-1.5 size-3.5 text-teal-400" />
                        Edit
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isToggling}
                        onClick={onToggle}
                        className="h-8 rounded-xl px-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                        {isToggling && (
                            <Loader2 className="mr-1.5 size-3.5 animate-spin text-teal-400" />
                        )}
                        {service.isActive ? "Deactivate" : "Activate"}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="h-8 rounded-xl px-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Delete
                    </Button>
                </div>
            </td>
        </tr>
    );
}