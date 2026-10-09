"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ServiceSearchFormProps {
    initialSearch: string;
}

export default function ServiceSearchForm({
    initialSearch,
}: ServiceSearchFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] =
        useState(initialSearch);

    const [isPending, startTransition] =
        useTransition();

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const params = new URLSearchParams(
            searchParams.toString(),
        );

        const trimmedSearch = search.trim();

        if (trimmedSearch) {
            params.set(
                "search",
                trimmedSearch,
            );
        } else {
            params.delete("search");
        }

        // Start a fresh search from page 1.
        params.delete("page");

        startTransition(() => {
            const queryString =
                params.toString();

            router.push(
                queryString
                    ? `/services?${queryString}`
                    : "/services",
            );
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full gap-3 lg:max-w-2xl"
        >
            <label
                htmlFor="service-search"
                className="sr-only"
            >
                Search services
            </label>

            <input
                id="service-search"
                name="search"
                type="search"
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                placeholder="Search services..."
                disabled={isPending}
                className="min-w-0 h-11 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:bg-slate-950 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60"
            />

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-teal-500 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
            >
                {isPending
                    ? "Searching..."
                    : "Search"}
            </button>
        </form>
    );
}