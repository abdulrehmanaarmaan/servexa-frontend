"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Search, Wrench, X } from "lucide-react";

import { useServices } from "@/hooks/useServices";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BASE_PATH = "/dashboard/customer/services";

export default function CustomerServicesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL holds the applied search; the input holds what the user is typing
  const search = searchParams.get("search") ?? "";
  const [inputValue, setInputValue] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  // Keep the input in sync when the URL changes (e.g. browser Back/Forward)
  if (search !== prevSearch) {
    setPrevSearch(search);
    setInputValue(search);
  }

  const { data, isLoading, isError, error, isPlaceholderData } = useServices({
    search,
  });

  const services = data?.data ?? [];

  const applySearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();

      if (trimmed === search) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      const queryString = params.toString();

      router.replace(
        queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH,
        { scroll: false },
      );
    },
    [router, search, searchParams],
  );

  // Debounce: update the URL (and therefore the query) 400ms after typing stops
  useEffect(() => {
    const timeout = setTimeout(() => {
      applySearch(inputValue);
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue, applySearch]);

  function clearSearch() {
    setInputValue("");
    applySearch("");
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Services
        </h1>

        <p className="text-sm text-slate-400">
          Find the service you need for your home or office.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl">
        <div className="relative rounded-xl transition-all focus-within:ring-2 focus-within:ring-teal-400/50">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            maxLength={100}
            placeholder="Search services..."
            aria-label="Search services"
            className="h-10 w-full rounded-xl border-white/10 bg-slate-900 pl-10 pr-9 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-teal-400/80 focus:bg-slate-950 focus:outline-none focus:ring-0 sm:h-9"
          />

          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "skeleton-1",
            "skeleton-2",
            "skeleton-3",
            "skeleton-4",
            "skeleton-5",
            "skeleton-6",
          ].map((id) => (
            <Card
              key={id}
              className="border-white/10 bg-slate-900/40 backdrop-blur-md"
            >
              <CardContent className="flex h-52 flex-col justify-between p-5 sm:p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-slate-800" />
                  <Skeleton className="h-4 w-full bg-slate-800/60" />
                  <Skeleton className="h-4 w-2/3 bg-slate-800/60" />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Skeleton className="h-6 w-20 bg-slate-800" />
                  <Skeleton className="h-8 w-28 bg-slate-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200 shadow-xl backdrop-blur-xl"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-400" />

          <div className="min-w-0">
            <h2 className="text-base font-bold text-white">
              Unable to load services
            </h2>

            <p className="mt-1 text-xs text-rose-200/90 sm:text-sm">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading services."}
            </p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <Card className="border-dashed border-white/15 bg-slate-900/40 shadow-xl backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-teal-400/10 shadow-inner shadow-teal-500/10 ring-1 ring-teal-400/30 sm:size-16">
              <Wrench className="size-7 text-teal-400 sm:size-8" />
            </div>

            <h2 className="text-base font-bold text-white sm:text-xl">
              No services found
            </h2>

            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
              {search
                ? `We couldn't find any services matching "${search}". Try checking for spelling errors or searching another keyword.`
                : "There are currently no active services available in the catalog."}
            </p>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-6 border-white/10 bg-slate-800/60 text-slate-200 hover:bg-white/10 hover:text-white",
                )}
              >
                Clear search filter
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
            isPlaceholderData && "opacity-60",
          )}
        >
          {services.map((service) => (
            <Card
              key={service.id}
              className="group flex flex-col justify-between overflow-hidden border-white/10 bg-slate-900/60 shadow-xl backdrop-blur-xl transition-all hover:border-teal-500/30 hover:bg-slate-900/80"
            >
              <CardContent className="flex flex-1 flex-col justify-between space-y-5 p-5 sm:p-6">
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-white transition-colors group-hover:text-teal-300 sm:text-lg">
                    {service.name}
                  </h2>

                  <p className="line-clamp-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
                    {service.description ||
                      "No description available for this service."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                      Starting at
                    </p>

                    <span className="text-base font-black text-teal-400 sm:text-lg">
                      {service.basePrice != null
                        ? `৳${Number(service.basePrice).toLocaleString()}`
                        : "Varies"}
                    </span>
                  </div>

                  <Link
                    href={`${BASE_PATH}/${service.id}`}
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "h-9 border border-teal-400/30 bg-teal-400/10 font-semibold text-teal-300 transition-all hover:bg-teal-400 hover:text-slate-950 active:scale-[0.98]",
                    )}
                  >
                    View service
                    <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}