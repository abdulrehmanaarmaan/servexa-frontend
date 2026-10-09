import {
    NextRequest,
    NextResponse,
} from "next/server";

const ACCESS_COOKIE = "accessToken";
const ROLE_COOKIE = "servexa_role";

const ROLE_DASHBOARDS = {
    CUSTOMER: "/dashboard/customer",
    TECHNICIAN: "/dashboard/technician",
    ADMIN: "/dashboard/admin",
} as const;

const AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
];

type UserRole = keyof typeof ROLE_DASHBOARDS;

function getDashboardForRole(
    role: string | undefined,
): string | null {
    if (
        !role ||
        !Object.prototype.hasOwnProperty.call(
            ROLE_DASHBOARDS,
            role,
        )
    ) {
        return null;
    }

    return ROLE_DASHBOARDS[
        role as UserRole
    ];
}

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const accessToken =
        request.cookies.get(ACCESS_COOKIE)?.value;

    const role =
        request.cookies.get(ROLE_COOKIE)?.value;

    const isDashboardRoute =
        pathname.startsWith("/dashboard/");

    const isAuthRoute =
        AUTH_ROUTES.some(
            (route) =>
                pathname === route ||
                pathname.startsWith(`${route}/`),
        );

    /*
     * Authenticated users should not remain
     * on login/register pages.
     */
    if (isAuthRoute && accessToken) {
        const dashboard =
            getDashboardForRole(role);

        if (dashboard) {
            return NextResponse.redirect(
                new URL(
                    dashboard,
                    request.url,
                ),
            );
        }

        /*
         * Token exists but role is missing/invalid.
         * Do not guess the dashboard.
         */
        return NextResponse.next();
    }

    /*
     * Dashboard routes require authentication.
     */
    if (
        isDashboardRoute &&
        !accessToken
    ) {
        const loginUrl = new URL(
            "/auth/login",
            request.url,
        );

        /*
         * Preserve the originally requested
         * internal route and its query string.
         */
        loginUrl.searchParams.set(
            "callbackUrl",
            `${pathname}${search}`,
        );

        return NextResponse.redirect(loginUrl);
    }

    /*
     * Role-based dashboard protection.
     */
    if (
        isDashboardRoute &&
        accessToken
    ) {
        if (
            pathname.startsWith(
                "/dashboard/customer",
            ) &&
            role !== "CUSTOMER"
        ) {
            return NextResponse.redirect(
                new URL(
                    "/unauthorized",
                    request.url,
                ),
            );
        }

        if (
            pathname.startsWith(
                "/dashboard/technician",
            ) &&
            role !== "TECHNICIAN"
        ) {
            return NextResponse.redirect(
                new URL(
                    "/unauthorized",
                    request.url,
                ),
            );
        }

        if (
            pathname.startsWith(
                "/dashboard/admin",
            ) &&
            role !== "ADMIN"
        ) {
            return NextResponse.redirect(
                new URL(
                    "/unauthorized",
                    request.url,
                ),
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/auth/:path*",
        "/dashboard/:path*",
    ],
};