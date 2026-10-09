import type { ApiResponse } from "@/types/api";

const API_PREFIX = "/api/backend";

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_PREFIX}/${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const text = await response.text();

    let payload: ApiResponse<T> | null = null;

    try {
        payload = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(
            "The server returned an invalid response.",
        );
    }

    if (!response.ok || payload?.success === false) {
        console.log(payload, response)
        throw new Error(
            payload?.message ||
                "Something went wrong. Please try again.",
        );
    }

    if (!payload) {
        throw new Error(
            "The server returned an empty response.",
        );
    }

    return payload.data;
}

export async function apiFetchResponse<T, M = unknown>(
    path: string,
    options: RequestInit = {},
): Promise<ApiResponse<T, M>> {
    const response = await fetch(`${API_PREFIX}/${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const text = await response.text();

    let payload: ApiResponse<T, M> | null = null;

    try {
        payload = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(
            "The server returned an invalid response.",
        );
    }

    if (!response.ok || payload?.success === false) {
        throw new Error(
            payload?.message ||
                "Something went wrong. Please try again.",
        );
    }

    if (!payload) {
        throw new Error(
            "The server returned an empty response.",
        );
    }

    return payload;
}