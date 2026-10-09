"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";

const quickLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

function getDashboardPath(
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN",
) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";

    case "TECHNICIAN":
      return "/dashboard/technician";

    case "CUSTOMER":
    default:
      return "/dashboard/customer";
  }
}

export default function Footer() {
  const pathname = usePathname();
  const { data: currentUser, isLoading } = useCurrentUser();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role)
    : null;

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400 text-slate-950 shadow-inner">
                <Wrench className="h-5 w-5" />
              </span>

              <span className="font-black">Servexa</span>
            </Link>

            <p className="mt-4 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
              A field service management platform for managing services,
              service requests, technicians, work orders, invoices, and
              payments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-1 text-xs sm:text-sm">
              {quickLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 transition-colors ${
                      active
                        ? "bg-teal-400/10 font-semibold text-teal-400"
                        : "hover:bg-white/5 hover:text-teal-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-1 text-xs sm:text-sm">
              {!isLoading && currentUser ? (
                <Link
                  href={dashboardPath!}
                  aria-current={
                    pathname.startsWith("/dashboard")
                      ? "page"
                      : undefined
                  }
                  className={`rounded-lg px-3 py-2 transition-colors ${
                    pathname.startsWith("/dashboard")
                      ? "bg-teal-400/10 font-semibold text-teal-400"
                      : "hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  Dashboard
                </Link>
              ) : !isLoading ? (
                <>
                  <Link
                    href="/auth/login"
                    aria-current={
                      pathname.startsWith("/auth/login")
                        ? "page"
                        : undefined
                    }
                    className={`rounded-lg px-3 py-2 transition-colors ${
                      pathname.startsWith("/auth/login")
                        ? "bg-teal-400/10 font-semibold text-teal-400"
                        : "hover:bg-white/5 hover:text-teal-400"
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    aria-current={
                      pathname.startsWith("/auth/register")
                        ? "page"
                        : undefined
                    }
                    className={`rounded-lg px-3 py-2 transition-colors ${
                      pathname.startsWith("/auth/register")
                        ? "bg-teal-400/10 font-semibold text-teal-400"
                        : "hover:bg-white/5 hover:text-teal-400"
                    }`}
                  >
                    Register
                  </Link>
                </>
              ) : null}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              {currentUser
                ? "Open your personalized dashboard to manage your Servexa activities."
                : "Sign in to access your dashboard and manage your service activities."}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Servexa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}