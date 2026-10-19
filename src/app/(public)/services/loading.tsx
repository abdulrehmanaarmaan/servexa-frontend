export default function ServicesLoading() {
    return (
        <main className="min-h-screen bg-slate-950 pb-20 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
            <section className="border-b border-white/10 bg-slate-900/60">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="h-6 w-36 animate-pulse rounded-full bg-slate-800" />

                    <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-2xl bg-slate-800" />

                    <div className="mt-4 h-5 max-w-xl animate-pulse rounded-xl bg-slate-800/80" />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
                <div className="mb-8 h-20 animate-pulse rounded-2xl border border-white/5 bg-slate-900/80" />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index!}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80"
                        >
                            <div className="aspect-[16/10] w-full animate-pulse bg-slate-800" />
                            <div className="space-y-4 p-6">
                                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-800" />
                                <div className="h-4 w-full animate-pulse rounded-md bg-slate-800/60" />
                                <div className="h-4 w-2/3 animate-pulse rounded-md bg-slate-800/60" />
                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="h-6 w-24 animate-pulse rounded-md bg-slate-800" />
                                    <div className="h-8 w-28 animate-pulse rounded-xl bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}