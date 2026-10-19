"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface ServiceSearchFormProps {
    initialSearch: string;
}

export default function ServiceSearchForm({
    initialSearch,
}: ServiceSearchFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(initialSearch);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const params = new URLSearchParams(searchParams.toString());
        const trimmedSearch = search.trim();

        if (trimmedSearch) {
            params.set("search", trimmedSearch);
        } else {
            params.delete("search");
        }

        params.delete("page");

        startTransition(() => {
            const queryString = params.toString();

            router.push(
                queryString ? `/services?${queryString}` : "/services",
            );
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-3 lg:max-w-2xl"
        >
            <label htmlFor="service-search" className="sr-only">
                Search services
            </label>

            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                    id="service-search"
                    name="search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search services..."
                    disabled={isPending}
                    className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-sm transition focus:border-teal-400/80 focus:bg-slate-950 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-300 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
            >
                {isPending ? (
                    <>
                        <Loader2 className="size-4 animate-spin text-slate-950" />
                        <span>Searching...</span>
                    </>
                ) : (
                    <span>Search</span>
                )}
            </button>
        </form>
    );
}