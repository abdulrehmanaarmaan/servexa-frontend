"use client";

import { useState } from "react";
import {
    AlertCircle,
    Check,
    Loader2,
    Sparkles,
    WandSparkles,
} from "lucide-react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { ServiceRequestAiHelperResponse } from "@/types/ai";

interface ServiceRequestAiHelperProps {
    description: string;
    onApplySuggestion: (description: string) => void;
    disabled?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 2000;

export default function ServiceRequestAiHelper({
    description,
    onApplySuggestion,
    disabled = false,
}: ServiceRequestAiHelperProps) {
    const [suggestion, setSuggestion] = useState("");
    const [clarifyingQuestions, setClarifyingQuestions] =
        useState<string[]>([]);
    const [disclaimer, setDisclaimer] = useState(
        "AI suggestions may be inaccurate. Review and edit them before submitting your request.",
    );
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const handleGenerate = async () => {
        const trimmedDescription = description.trim();

        if (trimmedDescription.length < 10) {
            setError(
                "Please enter at least 10 characters describing the problem before using AI assistance.",
            );
            return;
        }

        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
            setError("Your description cannot exceed 2,000 characters.");
            return;
        }

        setError("");
        setSuggestion("");
        setClarifyingQuestions([]);
        setIsApplied(false);
        setIsGenerating(true);

        try {
            const result =
                await apiFetch<ServiceRequestAiHelperResponse>(
                    endpoints.ai.serviceRequestHelper,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            description: trimmedDescription,
                        }),
                    },
                );

            const improvedDescription =
                result.improvedDescription?.trim();

            if (
                !improvedDescription ||
                improvedDescription.length < 10 ||
                improvedDescription.length > MAX_DESCRIPTION_LENGTH
            ) {
                throw new Error(
                    "The AI returned an invalid suggestion. Please try again.",
                );
            }

            setSuggestion(improvedDescription);
            setClarifyingQuestions(
                result.clarifyingQuestions ?? [],
            );
            setDisclaimer(
                result.disclaimer ||
                    "AI suggestions may be inaccurate. Review and edit them before submitting your request.",
            );
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Something went wrong while generating your suggestion.",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = () => {
        if (!suggestion || disabled) {
            return;
        }

        onApplySuggestion(suggestion);
        setIsApplied(true);
        setError("");
    };

    return (
        <section className="space-y-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400 shadow-inner">
                    <Sparkles
                        aria-hidden="true"
                        className="size-5"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white sm:text-base">
                        AI Description Assistant
                    </h3>

                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        Get help making your service description clearer
                        and more useful for the service team.
                    </p>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                disabled={disabled || isGenerating}
                className="h-10 w-full border-teal-500/30 bg-slate-950/60 text-teal-300 hover:bg-teal-500/10 hover:text-white sm:w-auto rounded-xl"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin text-teal-400" />
                        Improving description...
                    </>
                ) : (
                    <>
                        <WandSparkles className="mr-2 size-4 text-teal-400" />
                        Improve with AI
                    </>
                )}
            </Button>

            {error && (
                <Alert
                    variant="destructive"
                    className="border-rose-500/30 bg-rose-950/40 text-rose-300 backdrop-blur-md"
                >
                    <AlertCircle className="size-4 text-rose-400" />
                    <AlertTitle className="text-xs font-bold text-rose-200">
                        Unable to generate suggestion
                    </AlertTitle>
                    <AlertDescription className="text-xs text-rose-300/90">{error}</AlertDescription>
                </Alert>
            )}

            {suggestion && (
                <div className="space-y-4 rounded-xl border border-white/10 bg-slate-950/80 p-4 shadow-inner">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Suggested description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                            {suggestion}
                        </p>
                    </div>

                    {clarifyingQuestions.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Details you may want to add
                            </p>

                            <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm text-slate-300">
                                {clarifyingQuestions.map(
                                    (question, index) => (
                                        <li key={`${index}-${question}`}>
                                            {question}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}

                    <p className="text-xs leading-relaxed text-slate-500 pt-1">
                        {disclaimer}
                    </p>

                    <Button
                        type="button"
                        onClick={handleApply}
                        disabled={disabled}
                        className="h-10 w-full bg-teal-400 font-semibold text-slate-950 hover:bg-teal-300 sm:w-auto rounded-xl shadow-md shadow-teal-500/20 active:scale-[0.98]"
                    >
                        <Check className="mr-2 size-4" />
                        {isApplied
                            ? "Applied to Description"
                            : "Use This Description"}
                    </Button>
                </div>
            )}
        </section>
    );
}