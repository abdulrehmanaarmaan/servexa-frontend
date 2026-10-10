import Link from "next/link";

import { serverApiFetch } from "@/lib/api-server";
import { endpoints } from "@/lib/endpoints";
import ServiceSortSelect from "@/components/public/ServiceSortSelect";
import ServiceSearchForm from "@/components/public/ServiceSearchForm";

interface Service {
    id: string;
    name: string;
    description?: string | null;
    basePrice: number | string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

interface ServicesMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

type SortOption = "createdAt" | "name" | "basePrice";

interface ServicesPageProps {
    searchParams: Promise<{
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

const PAGE_SIZE = 9;

function formatPrice(price: number | string | null) {
    if (price === null) {
        return "Price on request";
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
        return "Price on request";
    }

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(numericPrice);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
    }).format(new Date(date));
}

function getSortOption(value: string | undefined): SortOption {
    if (value === "name" || value === "basePrice") {
        return value;
    }

    return "createdAt";
}

function buildServicesUrl({
    search,
    sort,
    page,
}: {
    search?: string;
    sort?: SortOption;
    page?: number;
}) {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (sort && sort !== "createdAt") {
        params.set("sort", sort);
    }

    if (page && page > 1) {
        params.set("page", String(page));
    }

    const queryString = params.toString();

    return queryString
        ? `/services?${queryString}`
        : "/services";
}

export default async function ServicesPage({
    searchParams,
}: ServicesPageProps) {
    const params = await searchParams;

    const search = params.search?.trim() ?? "";

    const sortBy = getSortOption(params.sort);

    const parsedPage = Number(params.page ?? "1");

    const currentPage =
        Number.isInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    const searchParamsForApi = new URLSearchParams();

    searchParamsForApi.set(
        "page",
        String(currentPage),
    );

    searchParamsForApi.set(
        "limit",
        String(PAGE_SIZE),
    );

    searchParamsForApi.set("isActive", "true");

    searchParamsForApi.set("sortBy", sortBy);

    searchParamsForApi.set(
        "sortOrder",
        sortBy === "name" ? "asc" : "desc",
    );

    if (search) {
        searchParamsForApi.set("search", search);
    }

    const result = await serverApiFetch<{
        data: Service[];
        meta: ServicesMeta;
    }>(
        `${endpoints.services.list}?${searchParamsForApi.toString()}`,
    );

    const services = result.data ?? [];

    const meta = result.meta ?? {
        page: currentPage,
        limit: PAGE_SIZE,
        total: services.length,
        totalPages: 1,
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.1),transparent_65%)]" />
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300 shadow-sm backdrop-blur-md">
                            Servexa Services
                        </div>

                        <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Professional services for your everyday needs
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                            Explore the services available through Servexa
                            and find the right solution for your needs.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
                {/* Filters Bar */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <ServiceSearchForm initialSearch={search} />

                        <ServiceSortSelect
                            search={search}
                            sort={sortBy}
                        />
                    </div>
                </div>

                {/* Result Information */}
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1">
                    <p className="text-sm font-medium text-slate-400">
                        {meta.total}{" "}
                        {meta.total === 1
                            ? "service"
                            : "services"}{" "}
                        available
                    </p>

                    {search && (
                        <p className="text-sm text-slate-400">
                            Search results for{" "}
                            <span className="font-semibold text-white">
                                &quot;{search}&quot;
                            </span>
                        </p>
                    )}
                </div>

                {/* Empty State */}
                {services.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-6 py-20 text-center shadow-xl backdrop-blur-xl">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400 shadow-inner">
                            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-label="Search" role="img">
                                <title>Search</title>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-white sm:text-xl">
                            No services found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                            {search
                                ? "No active services matched your search terms. Try modifying your keywords or clear your search."
                                : "There are currently no active services available on the platform. Please check back later."}
                        </p>

                        {search && (
                            <Link
                                href="/services"
                                className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                            >
                                Clear search filter
                            </Link>
                        )}
                    </div>
                )}

                {/* Services Grid */}
                {services.length > 0 && (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <article
                                    key={service.id}
                                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-teal-500/5"
                                >
                                    <div className="h-1.5 w-full bg-linear-to-r from-teal-400 to-emerald-400" />

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="text-lg font-bold text-white transition-colors group-hover:text-teal-300">
                                                {service.name}
                                            </h2>

                                            <span className="shrink-0 rounded-full bg-teal-400/10 px-2.5 py-1 text-xs font-semibold text-teal-300 border border-teal-400/20 backdrop-blur-md">
                                                Active
                                            </span>
                                        </div>

                                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
                                            {service.description ||
                                                "Professional service provided by Servexa."}
                                        </p>

                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                                Starting price
                                            </p>

                                            <p className="mt-1 text-xl font-black text-white">
                                                {formatPrice(service.basePrice)}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                                            <p className="text-xs text-slate-500">
                                                Added{" "}
                                                {formatDate(
                                                    service.createdAt,
                                                )}
                                            </p>

                                            <Link
                                                href={`/services/${service.id}`}
                                                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-teal-400 hover:bg-teal-500 hover:text-slate-950 active:scale-[0.98]"
                                            >
                                                View service
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta.totalPages > 1 && (
                            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                                <p className="text-sm font-medium text-slate-400">
                                    Page <span className="font-semibold text-white">{meta.page}</span> of{" "}
                                    <span className="font-semibold text-white">{meta.totalPages}</span>
                                </p>

                                <div className="flex items-center gap-2">
                                    {meta.page > 1 ? (
                                        <Link
                                            href={buildServicesUrl({
                                                search,
                                                sort: sortBy,
                                                page: meta.page - 1,
                                            })}
                                            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                                        >
                                            Previous
                                        </Link>
                                    ) : (
                                        <span className="cursor-not-allowed rounded-xl border border-white/10 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-600 opacity-60">
                                            Previous
                                        </span>
                                    )}

                                    {meta.page < meta.totalPages ? (
                                        <Link
                                            href={buildServicesUrl({
                                                search,
                                                sort: sortBy,
                                                page: meta.page + 1,
                                            })}
                                            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                                        >
                                            Next
                                        </Link>
                                    ) : (
                                        <span className="cursor-not-allowed rounded-xl border border-white/10 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-600 opacity-60">
                                            Next
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}