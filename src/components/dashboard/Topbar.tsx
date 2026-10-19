"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authService } from "@/services/auth.service";
import { useUIStore } from "@/store/ui.store";
import ThemeToggle from "../shared/ThemeToggle";

export default function Topbar() {
  const { data: user } = useCurrentUser();

  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name?.trim() || "Account";
  const email = user?.email || "";
  const role = user?.role || "CUSTOMER";

  const initials =
    displayName === "Account"
      ? "U"
      : displayName
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0))
          .join("")
          .toUpperCase();

  const formattedRole = role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, []);

  async function logout() {
    setProfileMenuOpen(false);

    try {
      await authService.logout();
      window.location.href = "/auth/login";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown logout error";

      console.error("Logout failed:", message);
      toast.error("Unable to sign out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile sidebar toggle */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-10 shrink-0 rounded-xl border border-white/10 bg-slate-900/50 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </Button>

        {/* Flexible space */}
        <div className="min-w-0 flex-1" />

        {/* Theme control */}
        <ThemeToggle />

        {/* Servexa identifier */}
        <div className="hidden items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3.5 py-1.5 text-teal-300 shadow-inner sm:flex">
          <Zap className="size-3.5 text-teal-400" aria-hidden="true" />
          <span className="text-xs font-bold tracking-wide">Servexa</span>
        </div>

        {/* Profile dropdown */}
        <div ref={profileMenuRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex max-w-56 items-center gap-2.5 rounded-full border border-white/10 bg-white/5 p-1.5 pr-3 text-left transition-all hover:border-teal-400/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-xs font-bold text-teal-300 shadow-inner ring-1 ring-teal-400/30">
              {initials}
            </span>

            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-xs font-semibold text-slate-100">
                {displayName}
              </span>
              <span className="block truncate text-[10px] text-slate-400">
                {formattedRole}
              </span>
            </span>

            <ChevronDown
              className={`hidden size-4 shrink-0 text-slate-400 transition-transform duration-200 sm:block ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {profileMenuOpen && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 top-full z-50 mt-2.5 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl"
            >
              {/* Account summary */}
              <div className="border-b border-white/10 px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-sm font-bold text-teal-300 shadow-inner ring-1 ring-teal-400/30">
                    {initials}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                      {displayName}
                    </p>

                    {email && (
                      <p className="truncate text-xs text-slate-400">
                        {email}
                      </p>
                    )}

                    <p className="mt-0.5 text-xs font-semibold text-teal-300">
                      {formattedRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account actions */}
              <div className="space-y-1 py-2">
                <Link
                  href="/dashboard/profile"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <UserRound
                    className="size-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <Settings
                    className="size-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <span>Account settings</span>
                </Link>
              </div>

              {/* Sign out */}
              <div className="border-t border-white/10 pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}