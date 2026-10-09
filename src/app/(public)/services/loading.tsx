export default function ServicesLoading() {
    return (
        <main className="min-h-screen bg-slate-950 pb-20 text-slate-100">
            <section className="border-b border-white/10 bg-slate-900/60">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="h-5 w-32 animate-pulse rounded-full bg-slate-800" />

                    <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-xl bg-slate-800" />

                    <div className="mt-4 h-5 max-w-xl animate-pulse rounded bg-slate-800" />
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
                <div className="mb-8 h-24 animate-pulse rounded-2xl bg-slate-900" />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="h-64 animate-pulse rounded-2xl bg-slate-900"
                            />
                        ),
                    )}
                </div>
            </section>
        </main>
    );
}