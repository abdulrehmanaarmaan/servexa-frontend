import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not configured.");
}

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const ROLE_COOKIE = "servexa_role";

const TOKEN_KEYS = [
  "accessToken",
  "refreshToken"
];

const isProd = process.env.NODE_ENV === "production";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function findValue(
  value: unknown,
  keys: string[],
): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findValue(item, keys);

      if (found) {
        return found;
      }
    }

    return undefined;
  }

  const object = value as Record<string, unknown>;

  for (const key of keys) {
    const candidate = object[key];

    if (
      typeof candidate === "string" &&
      candidate.length > 0
    ) {
      return candidate;
    }
  }

  for (const child of Object.values(object)) {
    const found = findValue(child, keys);

    if (found) {
      return found;
    }
  }

  return undefined;
}

function stripTokens(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripTokens);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value as Record<string, unknown>,
      )
        .filter(
          ([key]) =>
            !TOKEN_KEYS.includes(key),
        )
        .map(
          ([key, child]) => [
            key,
            stripTokens(child),
          ],
        ),
    );
  }

  return value;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Extract a cookie value from a Set-Cookie header.
 *
 * Example:
 *
 * accessToken=abc123; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax
 *
 * returns:
 *
 * { name: "accessToken", value: "abc123" }
 */
function parseSetCookie(
  setCookie: string,
): {
  name: string;
  value: string;
} | null {
  const firstPart = setCookie.split(";")[0];

  const separatorIndex = firstPart.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const name = firstPart
    .slice(0, separatorIndex)
    .trim();

  const value = firstPart
    .slice(separatorIndex + 1)
    .trim();

  if (!name || !value) {
    return null;
  }

  return {
    name,
    value,
  };
}

/**
 * Reads authentication cookies set by the backend
 * and stores equivalent cookies on the Next.js
 * frontend domain.
 */
function setAuthenticationCookiesFromBackend(
  response: NextResponse,
  backendResponse: Response,
) {
  let setCookies: string[] = [];

  /**
   * Node's Headers implementation supports getSetCookie()
   * for multiple Set-Cookie headers.
   */
  if (
    typeof backendResponse.headers.getSetCookie ===
    "function"
  ) {
    setCookies =
      backendResponse.headers.getSetCookie();
  } else {
    const combinedCookieHeader =
      backendResponse.headers.get(
        "set-cookie",
      );

    if (combinedCookieHeader) {
      setCookies = combinedCookieHeader
        .split(/,(?=[^;,]+=)/)
        .map((cookie) => cookie.trim());
    }
  }

  for (const setCookie of setCookies) {
    const parsedCookie =
      parseSetCookie(setCookie);

    if (!parsedCookie) {
      continue;
    }

    const {
      name,
      value,
    } = parsedCookie;

    if (name === ACCESS_COOKIE) {
      response.cookies.set(
        ACCESS_COOKIE,
        value,
        cookieOptions(
          60 * 60 * 24,
        ),
      );
    }

    if (name === REFRESH_COOKIE) {
      response.cookies.set(
        REFRESH_COOKIE,
        value,
        cookieOptions(
          60 *
          60 *
          24 *
          7,
        ),
      );
    }

    if (name === ROLE_COOKIE) {
      response.cookies.set(
        ROLE_COOKIE,
        value,
        cookieOptions(
          60 *
          60 *
          24 *
          7,
        ),
      );
    }
  }
}

async function handler(
  request: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;

  const backendPath = path.join("/");

  const query = request.nextUrl.search;

  const targetUrl =
    `${BACKEND_API_URL}/${backendPath}${query}`;

  const isLogin =
    backendPath === "auth/login";

  const isRegister =
    backendPath === "auth/register";

  const isRefresh =
    backendPath ===
    "auth/refresh-token";

  const isLogout =
    backendPath === "auth/logout";

  const isGoogleLogin =
    backendPath === "auth/google";

  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get(
      ACCESS_COOKIE,
    )?.value;

  const refreshToken =
    cookieStore.get(
      REFRESH_COOKIE,
    )?.value;

  const headers = new Headers();

  const contentType =
    request.headers.get(
      "content-type",
    );

  if (contentType) {
    headers.set(
      "content-type",
      contentType,
    );
  }

  /*
   * Forward the access token to the backend
   * through Authorization.
   */
  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  /*
   * Forward cookies when the backend
   * expects them directly.
   */
  const forwardedCookies: string[] = [];

  if (accessToken) {
    forwardedCookies.push(
      `accessToken=${accessToken}`,
    );
  }

  if (
    isRefresh &&
    refreshToken
  ) {
    forwardedCookies.push(
      `refreshToken=${refreshToken}`,
    );
  }

  if (
    forwardedCookies.length > 0
  ) {
    headers.set(
      "cookie",
      forwardedCookies.join("; "),
    );
  }

  let body:
    | ArrayBuffer
    | undefined;

  if (
    request.method !== "GET" &&
    request.method !== "HEAD"
  ) {
    body =
      await request.arrayBuffer();
  }

  let backendResponse: Response;

  try {
    backendResponse =
      await fetch(
        targetUrl,
        {
          method:
            request.method,
          headers,
          body,
          cache: "no-store",
        },
      );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reach the server.",
      },
      {
        status: 502,
      },
    );
  }

  const responseText =
    await backendResponse.text();

  let parsed: unknown = null;

  try {
    parsed = responseText
      ? JSON.parse(
        responseText,
      )
      : null;
  } catch {
    parsed = null;
  }

  const setsSession =
    isLogin ||
    isRegister ||
    isRefresh ||
    isGoogleLogin;

  const response =
    new NextResponse(
      setsSession &&
        parsed !== null
        ? JSON.stringify(
          stripTokens(
            parsed,
          ),
        )
        : responseText,
      {
        status:
          backendResponse.status,
        headers: {
          "Content-Type":
            backendResponse
              .headers
              .get(
                "content-type",
              ) ||
            "application/json",
        },
      },
    );

  /*
   * IMPORTANT:
   *
   * The backend authentication controller
   * stores accessToken, refreshToken and
   * servexa_role in Set-Cookie headers.
   *
   * Because the backend is being called from
   * the Next.js server, those cookies do not
   * automatically reach the browser.
   *
   * We therefore recreate them on the
   * frontend domain.
   */
  if (
    backendResponse.ok &&
    setsSession
  ) {
    setAuthenticationCookiesFromBackend(
      response,
      backendResponse,
    );

    /*
     * Refresh may return the tokens in JSON
     * rather than only through cookies.
     *
     * Keep this fallback as well.
     */
    const newAccessToken =
      findValue(
        parsed,
        [
          "accessToken",
          "access_token",
        ],
      );

    const newRefreshToken =
      findValue(
        parsed,
        [
          "refreshToken",
          "refresh_token",
        ],
      );

    const role =
      findValue(
        parsed,
        ["role"],
      );

    if (newAccessToken) {
      response.cookies.set(
        ACCESS_COOKIE,
        newAccessToken,
        cookieOptions(
          60 * 60 * 24,
        ),
      );
    }

    if (newRefreshToken) {
      response.cookies.set(
        REFRESH_COOKIE,
        newRefreshToken,
        cookieOptions(
          60 *
          60 *
          24 *
          7,
        ),
      );
    }

    if (role) {
      response.cookies.set(
        ROLE_COOKIE,
        role,
        cookieOptions(
          60 *
          60 *
          24 *
          7,
        ),
      );
    }
  }

  /*
   * Remove authentication cookies
   * during logout.
   */
  if (isLogout) {
    response.cookies.delete(
      ACCESS_COOKIE,
    );

    response.cookies.delete(
      REFRESH_COOKIE,
    );

    response.cookies.delete(
      ROLE_COOKIE,
    );
  }

  return response;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;