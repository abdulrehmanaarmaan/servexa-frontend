"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  ScrollText,
  User,
  UserRoundCog,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authService } from "@/services/auth.service";
import { useUIStore } from "@/store/ui.store";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const customerItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    label: "Services",
    href: "/dashboard/customer/services",
    icon: Wrench,
  },
  {
    label: "My Requests",
    href: "/dashboard/customer/requests",
    icon: ClipboardList,
  },
  {
    label: "Work Orders",
    href: "/dashboard/customer/work-orders",
    icon: FileText,
  },
  {
    label: "Invoices",
    href: "/dashboard/customer/invoices",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/dashboard/customer/payments",
    icon: CreditCard,
  },
  {
    label: "Addresses",
    href: "/dashboard/customer/addresses",
    icon: MapPin,
  },
  {
    label: "Notifications",
    href: "/dashboard/customer/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

const technicianItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/technician",
    icon: LayoutDashboard,
  },
  {
    label: "My Jobs",
    href: "/dashboard/technician/jobs",
    icon: ClipboardList,
  },
  {
    label: "Availability",
    href: "/dashboard/technician/availability",
    icon: CalendarClock,
  },
  {
    label: "Notifications",
    href: "/dashboard/technician/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

const adminItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Services",
    href: "/dashboard/admin/services",
    icon: Wrench,
  },
  {
    label: "Service Requests",
    href: "/dashboard/admin/requests",
    icon: ClipboardList,
  },
  {
    label: "Work Orders",
    href: "/dashboard/admin/work-orders",
    icon: FileText,
  },
  {
    label: "Assignments",
    href: "/dashboard/admin/assignments",
    icon: UserRoundCog,
  },
  {
    label: "Payments",
    href: "/dashboard/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    href: "/dashboard/admin/notifications",
    icon: Bell,
  },
  {
    label: "Audit Logs",
    href: "/dashboard/admin/audit-logs",
    icon: ScrollText,
  },
  {
    label: "Technicians",
    href: "/dashboard/admin/technicians",
    icon: Wrench,
  },
  {
    label: "Invoices",
    href: "/dashboard/admin/invoices",
    icon: FileText,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  const items =
    user?.role === "ADMIN"
      ? adminItems
      : user?.role === "TECHNICIAN"
        ? technicianItems
        : customerItems;

  async function logout() {
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

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close sidebar"
        aria-hidden={!sidebarOpen}
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Sidebar */}
      <aside
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:z-40 lg:translate-x-0 shadow-2xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/"
            onClick={closeSidebar}
            className="group flex items-center gap-2.5 text-xl font-black tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-400/10 shadow-inner ring-1 ring-teal-400/30 transition-colors group-hover:bg-teal-400/20">
              <Zap className="size-4 text-teal-400" />
            </span>

            <span>
              Serve<span className="text-teal-400">xa</span>
            </span>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Role-based navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              item.label === "Dashboard"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400",
                  active
                    ? "bg-teal-400/10 font-semibold text-teal-300 shadow-inner ring-1 ring-teal-400/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    active
                      ? "text-teal-400"
                      : "text-slate-400 group-hover:text-slate-200",
                  )}
                  aria-hidden="true"
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-white/10 p-4 bg-slate-950/50">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 active:scale-[0.98]"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}