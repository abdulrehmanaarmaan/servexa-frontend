"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, UserRound, Wrench, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authService } from "@/services/auth.service";

const navigationLinks = [
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const pathname = usePathname();
  const { data: currentUser, isLoading } = useCurrentUser();

  const closeMenu = () => {
    setIsOpen(false);
  };

  const dashboardPath = currentUser
    ? getDashboardPath(currentUser.role)
    : null;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isDashboardActive = pathname.startsWith("/dashboard");
  const isProfileActive = pathname === "/dashboard/profile";

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      closeMenu();

      await authService.logout();

      window.location.href = "/auth/login";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign out.";

      console.error("Sign out error:", message);

      toast.error("Unable to sign out. Please try again.");
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400 text-slate-950 shadow-inner">
            <Wrench className="h-5 w-5" />
          </span>

          <span className="font-black">Servexa</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navigationLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-teal-400/10 text-teal-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {!isLoading && currentUser ? (
            <>
              {/* Dashboard */}
              <Link
                href={dashboardPath!}
                aria-current={
                  isDashboardActive ? "page" : undefined
                }
                className={`ml-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isDashboardActive
                    ? "bg-teal-400/10 text-teal-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                }`}
              >
                Dashboard
              </Link>

              {/* Profile */}
              <Link
                href="/dashboard/profile"
                aria-current={
                  isProfileActive ? "page" : undefined
                }
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isProfileActive
                    ? "bg-teal-400/10 text-teal-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                }`}
                title={currentUser.email}
              >
                <UserRound className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              {/* Sign out */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className="ml-1 rounded-lg text-slate-300 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Button>
            </>
          ) : !isLoading ? (
            <>
              {/* Login */}
              <Link
                href="/auth/login"
                className={`ml-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith("/auth/login")
                    ? "bg-teal-400/10 text-teal-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                }`}
              >
                Login
              </Link>

              {/* Register */}
              <Button
                size="sm"
                className="rounded-xl border border-teal-400/30 bg-teal-400 px-4 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/10 hover:bg-teal-300 active:scale-[0.98]"
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          ) : null}
        </nav>

        {/* Mobile menu button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label={
            isOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-teal-400/10 text-teal-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {!isLoading && currentUser ? (
              <>
                {/* Dashboard */}
                <Link
                  href={dashboardPath!}
                  onClick={closeMenu}
                  aria-current={
                    isDashboardActive ? "page" : undefined
                  }
                  className={`mt-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isDashboardActive
                      ? "bg-teal-400/10 text-teal-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Profile */}
                <Link
                  href="/dashboard/profile"
                  onClick={closeMenu}
                  aria-current={
                    isProfileActive ? "page" : undefined
                  }
                  className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isProfileActive
                      ? "bg-teal-400/10 text-teal-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  <UserRound className="h-4 w-4" />
                  <span>Profile</span>
                </Link>

                {/* Signed-in account information */}
                <div className="mx-4 mt-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                  <p className="truncate text-xs text-slate-500">
                    Signed in as
                  </p>

                  <p
                    className="mt-1 truncate text-sm font-medium text-slate-200"
                    title={currentUser.email}
                  >
                    {currentUser.email}
                  </p>
                </div>

                {/* Sign out */}
                <button
                  type="button"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  className="mt-3 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : !isLoading ? (
              <>
                {/* Login */}
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className={`mt-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname.startsWith("/auth/login")
                      ? "bg-teal-400/10 text-teal-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-teal-400"
                  }`}
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  href="/auth/register"
                  onClick={closeMenu}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-teal-400 px-4 text-sm font-bold text-slate-950 shadow-md shadow-teal-500/10 transition-all hover:bg-teal-300 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}