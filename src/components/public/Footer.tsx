"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import {
  SiGithub,
  SiFacebook,
  SiInstagram,
} from "@icons-pack/react-simple-icons";

import { useCurrentUser } from "@/hooks/useCurrentUser";

// Types
type QuickLink = {
  href: string;
  label: string;
};

type SocialLink = {
  label: string;
  href: string | undefined;
  icon: React.ComponentType<{ className?: string }> | (() => React.JSX.Element);
};

type DashboardRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

// LinkedIn Custom SVG Component
const LinkedInIcon = ({
  className = "h-5 w-5",
}: {
  className?: string;
}) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.205 0 22.222 0h.003z" />
  </svg>
);

const quickLinks: QuickLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_SERVEXA_LINKEDIN_URL ?? "",
    icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: process.env.NEXT_PUBLIC_SERVEXA_GITHUB_URL ?? "",
    icon: SiGithub,
  },
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SERVEXA_FACEBOOK_URL ?? "",
    icon: SiFacebook,
  },
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SERVEXA_INSTAGRAM_URL ?? "",
    icon: SiInstagram,
  },
].filter((social) => social.href.trim().length > 0);

function getDashboardPath(role: DashboardRole): string {
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

  const contactEmail = process.env.NEXT_PUBLIC_SERVEXA_CONTACT_EMAIL;
  const contactPhone = process.env.NEXT_PUBLIC_SERVEXA_CONTACT_PHONE;

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role as DashboardRole)
    : null;

  const linkClass = (active: boolean): string =>
    `rounded-xl px-3.5 py-2 transition-all duration-200 block ${
      active
        ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
        : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
    }`;

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              href="/"
              aria-label="Servexa home"
              className="group inline-flex items-center gap-3 text-lg font-bold text-white transition-opacity hover:opacity-90"
            >
              <span className="flex size-10 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400 text-slate-950 shadow-inner">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </span>

              <span className="text-xl font-black tracking-tight">
                Serve<span className="text-teal-400">xa</span>
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              A field service management platform for managing services,
              service requests, technicians, work orders, invoices, and
              payments.
            </p>

            {/* Contact information */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Get in touch
              </h3>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-teal-400"
              >
                Contact our team
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex w-fit items-center gap-2.5 break-all text-sm text-slate-400 transition-colors hover:text-teal-400"
                >
                  <Mail
                    className="h-4 w-4 shrink-0 text-teal-400/70"
                    aria-hidden="true"
                  />
                  servexa@gmail.com
                </a>
              )}

              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                  className="flex w-fit items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-teal-400"
                >
                  <Phone
                    className="h-4 w-4 shrink-0 text-teal-400/70"
                    aria-hidden="true"
                  />
                  {contactPhone}
                </a>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Follow Servexa
                </h3>

                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Servexa on ${label} (opens in a new tab)`}
                      title={label}
                      className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 active:scale-[0.98]"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore
            </h3>

            <nav
              aria-label="Footer navigation"
              className="flex flex-col items-start gap-1.5 text-sm"
            >
              {quickLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={linkClass(active)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Account
            </h3>

            <nav
              aria-label="Account navigation"
              className="flex flex-col items-start gap-1.5 text-sm"
            >
              {!isLoading && currentUser && dashboardPath ? (
                <Link
                  href={dashboardPath}
                  aria-current={
                    pathname.startsWith("/dashboard") ? "page" : undefined
                  }
                  className={linkClass(
                    pathname.startsWith("/dashboard"),
                  )}
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
                    className={linkClass(
                      pathname.startsWith("/auth/login"),
                    )}
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
                    className={linkClass(
                      pathname.startsWith("/auth/register"),
                    )}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-500 animate-pulse">
                  <span className="size-2 rounded-full bg-teal-400" />
                  Loading account…
                </div>
              )}
            </nav>

            <p className="max-w-xs text-xs leading-relaxed text-slate-500 pt-2">
              {currentUser
                ? "Open your personalized dashboard to manage your Servexa activities."
                : "Sign in to access your dashboard and manage your service activities."}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Servexa. All rights reserved.
            </p>

            <Link
              href="/contact"
              className="text-xs text-slate-500 transition-colors hover:text-teal-400"
            >
              Need help? Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}