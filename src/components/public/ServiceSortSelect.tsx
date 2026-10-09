"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

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

    function handleChange(
        event: ChangeEvent<HTMLSelectElement>,
    ) {
        const nextSort = event.target.value;
        const params = new URLSearchParams();

        if (search) {
            params.set("search", search);
        }

        if (nextSort !== "createdAt") {
            params.set("sort", nextSort);
        }

        const queryString = params.toString();

        // Page is intentionally dropped so sorting resets to page 1
        router.push(
            queryString
                ? `/services?${queryString}`
                : "/services",
        );
    }

    return (
        <div className="flex items-center gap-3">
            <label
                htmlFor="service-sort"
                className="whitespace-nowrap text-sm font-medium text-slate-600"
            >
                Sort by
            </label>

            <select
                key={sort}
                id="service-sort"
                name="sort"
                defaultValue={sort}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
                <option value="createdAt">Newest</option>
                <option value="name">Name</option>
                <option value="basePrice">Price</option>
            </select>
        </div>
    );
}