"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
  Wrench,
  CreditCard,
  UserRoundCog,
  CalendarClock,
  ScrollText,
  Zap,
  User,
  Bell,
  MapPin,
  X,
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

      console.error(message);
      toast.error("Unable to sign out.");
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
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden",
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-300 ease-in-out lg:z-40 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/"
            onClick={closeSidebar}
            className="group flex items-center gap-2 text-xl font-black tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-400/10 ring-1 ring-teal-400/30 transition-all group-hover:bg-teal-400/20">
              <Zap className="size-4 text-teal-400" />
            </div>

            <span>
              Serve<span className="text-teal-400">xa</span>
            </span>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-teal-400/10 font-semibold text-teal-300 ring-1 ring-teal-400/20"
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
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Footer Actions */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition-all hover:bg-rose-500/10 hover:text-rose-300 active:scale-[0.98]"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
