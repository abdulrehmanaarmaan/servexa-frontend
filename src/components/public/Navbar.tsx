"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, UserRound, Wrench, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authService } from "@/services/auth.service";
import ThemeToggle from "@/components/shared/ThemeToggle";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function getDashboardPath(role: "CUSTOMER" | "TECHNICIAN" | "ADMIN") {
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const pathname = usePathname();
  const { data: currentUser, isLoading } = useCurrentUser();

  const closeMenu = () => setIsOpen(false);

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role)
    : null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isDashboardActive = pathname.startsWith("/dashboard");
  const isProfileActive = pathname === "/dashboard/profile";

  async function handleSignOut() {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      closeMenu();

      await authService.logout();
      window.location.href = "/auth/login";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign out.";

      console.error("Sign out error:", message);
      toast.error("Unable to sign out. Please try again.");
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="flex size-9 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400 text-slate-950 shadow-inner">
            <Wrench className="size-5" />
          </span>
          <span className="text-xl font-black tracking-tight">
            Serve<span className="text-teal-400">xa</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {navigationLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="ml-2 mr-1 flex items-center">
            <ThemeToggle />
          </div>

          {!isLoading && currentUser ? (
            <>
              <Link
                href={dashboardPath!}
                aria-current={isDashboardActive ? "page" : undefined}
                className={`ml-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isDashboardActive
                    ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/profile"
                aria-current={isProfileActive ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isProfileActive
                    ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                }`}
                title={currentUser.email}
              >
                <UserRound className="size-4 text-teal-400/70" />
                <span>Profile</span>
              </Link>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className="ml-1 h-9 rounded-xl px-3 text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400"
              >
                <LogOut className="mr-2 size-4" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Button>
            </>
          ) : !isLoading ? (
            <>
              <Link
                href="/auth/login"
                className={`ml-1 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith("/auth/login")
                    ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                }`}
              >
                Login
              </Link>

              <Button
                size="sm"
                className="ml-2 h-9 rounded-xl bg-teal-400 px-4 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98]"
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          ) : null}
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-xl border border-white/10 bg-slate-900/50 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-5 sm:px-6">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!isLoading && currentUser ? (
              <>
                <Link
                  href={dashboardPath!}
                  onClick={closeMenu}
                  aria-current={isDashboardActive ? "page" : undefined}
                  className={`mt-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isDashboardActive
                      ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenu}
                  aria-current={isProfileActive ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isProfileActive
                      ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  <UserRound className="size-4 text-teal-400/70" />
                  <span>Profile</span>
                </Link>

                <div className="my-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 shadow-inner">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Signed in as
                  </p>
                  <p
                    className="mt-1 truncate text-xs font-bold text-white"
                    title={currentUser.email}
                  >
                    {currentUser.email}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="size-4" />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : !isLoading ? (
              <div className="mt-2 flex flex-col gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith("/auth/login")
                      ? "bg-teal-400/10 font-semibold text-teal-400 ring-1 ring-teal-400/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  onClick={closeMenu}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-400 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-300 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}