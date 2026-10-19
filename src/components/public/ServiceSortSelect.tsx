"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { ArrowUpDown } from "lucide-react";

type SortOption = "createdAt" | "name" | "basePrice";

interface ServiceSortSelectProps {
    search: string;
    sort: SortOption;
}

export default function ServiceSortSelect({
    search,
    sort,
}: ServiceSortSelectProps) {
    const router = useRouter();

    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        const nextSort = event.target.value;
        const params = new URLSearchParams();

        if (search) {
            params.set("search", search);
        }

        if (nextSort !== "createdAt") {
            params.set("sort", nextSort);
        }

        const queryString = params.toString();

        router.push(
            queryString ? `/services?${queryString}` : "/services",
        );
    }

    return (
        <div className="flex items-center gap-2.5 shrink-0">
            <label
                htmlFor="service-sort"
                className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
                <ArrowUpDown className="size-3.5 text-teal-400" />
                <span>Sort by</span>
            </label>

            <select
                key={sort}
                id="service-sort"
                name="sort"
                defaultValue={sort}
                onChange={handleChange}
                className="h-11 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-medium text-slate-100 outline-none backdrop-blur-sm transition focus:border-teal-400/80 focus:ring-2 focus:ring-teal-400/20"
            >
                <option value="createdAt" className="bg-slate-900 text-slate-100">Newest</option>
                <option value="name" className="bg-slate-900 text-slate-100">Name</option>
                <option value="basePrice" className="bg-slate-900 text-slate-100">Price</option>
            </select>
        </div>
    );
}