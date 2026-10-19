import Image from "next/image";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

interface ServiceImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

export default function ServiceImage({
    src,
    alt,
    className,
    sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
    priority = false,
}: ServiceImageProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden bg-slate-900",
                className,
            )}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div
                    className="flex size-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"
                    role="img"
                    aria-label={`${alt} (no image)`}
                >
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-400 shadow-inner">
                        <Wrench className="size-6" />
                    </div>
                </div>
            )}
        </div>
    );
}