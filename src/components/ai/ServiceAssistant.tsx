"use client";

import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { ServiceAssistantResponse } from "@/types/ai";
import { Bot, Loader2, Send, Sparkles, Tag, AlertCircle } from "lucide-react";

export default function ServiceAssistant() {
    const [question, setQuestion] = useState("");
    const [result, setResult] =
        useState<ServiceAssistantResponse | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuestion = question.trim();

        if (trimmedQuestion.length < 3) {
            setError("Please enter at least 3 characters.");
            return;
        }

        if (trimmedQuestion.length > 500) {
            setError("Your question cannot exceed 500 characters.");
            return;
        }

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await apiFetch<ServiceAssistantResponse>(
                endpoints.ai.serviceAssistant,
                {
                    method: "POST",
                    body: JSON.stringify({
                        question: trimmedQuestion,
                    }),
                },
            );

            setResult(response);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to get an AI response. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mx-auto w-full max-w-4xl space-y-8">
            {/* Input Card Container */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500" />
                
                <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-400 shadow-inner">
                        <Bot className="size-6" />
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-0.5 text-xs font-semibold text-teal-300 shadow-sm backdrop-blur-md">
                            <Sparkles className="size-3 text-teal-400" />
                            <span>SERVEXA AI</span>
                        </div>

                        <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                            How can we help?
                        </h2>

                        <p className="mt-1 text-xs sm:text-sm text-slate-400">
                            Ask about Servexa or describe the service you need.
                            Answers about services are based on our active service
                            catalog.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label
                        htmlFor="service-assistant-question"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                    >
                        Your question
                    </label>

                    <div className="relative">
                        <textarea
                            id="service-assistant-question"
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            placeholder="For example: Which service might help if my AC is not cooling?"
                            maxLength={500}
                            minLength={3}
                            required
                            rows={4}
                            disabled={isLoading}
                            className="w-full resize-y rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none backdrop-blur-sm transition-all focus:border-teal-400/80 focus:bg-slate-950/80 focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                        <p className="text-xs font-mono text-slate-400">
                            {question.length}/500 characters
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading || question.trim().length < 3}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Ask Servexa AI
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div
                        role="alert"
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm text-rose-300 backdrop-blur-xl shadow-lg"
                    >
                        <AlertCircle className="size-5 shrink-0 text-rose-400 mt-0.5" />
                        <span className="leading-relaxed">{error}</span>
                    </div>
                )}
            </div>

            {/* Results Section */}
            {result && (
                <div className="space-y-6">
                    {/* AI Answer Box */}
                    <section
                        aria-live="polite"
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex size-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-400 shadow-inner">
                                <Sparkles className="size-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Servexa AI's answer
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5">
                            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-slate-300">
                                {result.answer}
                            </p>
                        </div>
                    </section>

                    {/* Related Services Grid */}
                    {result.relevantServices.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">
                                    Related services
                                </h3>
                                <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1 rounded-full">
                                    {result.relevantServices.length} found
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {result.relevantServices.map((service) => (
                                    <article
                                        key={service.id}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-teal-500/40 hover:bg-slate-900"
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500/40 to-emerald-500/40 opacity-0 transition-opacity group-hover:opacity-100" />

                                        <div>
                                            <h4 className="font-bold text-white text-base">
                                                {service.name}
                                            </h4>

                                            {service.description && (
                                                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-3">
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
                                            <Tag className="size-3.5 text-teal-400 shrink-0" />
                                            <p className="text-xs sm:text-sm font-semibold text-teal-300">
                                                {service.basePrice === null
                                                    ? "Contact us for pricing information."
                                                    : `Base price: ৳${Number(
                                                          service.basePrice,
                                                      ).toLocaleString("en-BD")}`}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Disclaimer Note */}
                    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-center sm:text-left">
                        <p className="text-xs leading-relaxed text-slate-400">
                            AI-generated information can be inaccurate. Confirm
                            important details with Servexa before making decisions.
                            Prices shown are catalog base prices, not necessarily
                            a final quote.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}