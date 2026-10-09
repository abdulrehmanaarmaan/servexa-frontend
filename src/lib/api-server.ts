import "server-only";

import { cookies } from "next/headers";

import type { ApiResponse } from "@/types/api";

const API_PREFIX =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(
        /\/$/,
        "",
    );

if (!API_PREFIX) {
  throw new Error(
    "NEXT_PUBLIC_BACKEND_API_URL is not defined.",
  );
}

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(
      ({ name, value }) =>
        `${name}=${value}`,
    )
    .join("; ");
}

export async function serverApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieHeader =
    await getCookieHeader();

  const response = await fetch(
    `${API_PREFIX}/${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader
          ? {
              Cookie: cookieHeader,
            }
          : {}),
        ...options.headers,
      },
      cache: "no-store",
    },
  );

  const text = await response.text();

  let payload: ApiResponse<T> | null = null;

  try {
    payload = text
      ? JSON.parse(text)
      : null;
  } catch {
    throw new Error(
      "The server returned an invalid response.",
    );
  }

  if (
    !response.ok ||
    payload?.success === false
  ) {
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

export async function serverApiFetchResponse<
  T,
  M = unknown,
>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T, M>> {
  const cookieHeader =
    await getCookieHeader();

  const response = await fetch(
    `${API_PREFIX}/${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader
          ? {
              Cookie: cookieHeader,
            }
          : {}),
        ...options.headers,
      },
      cache: "no-store",
    },
  );

  const text = await response.text();

  let payload: ApiResponse<T, M> | null = null;

  try {
    payload = text
      ? JSON.parse(text)
      : null;
  } catch {
    throw new Error(
      "The server returned an invalid response.",
    );
  }

  if (
    !response.ok ||
    payload?.success === false
  ) {
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