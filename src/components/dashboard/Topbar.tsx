"use client";

import { Menu, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";

export default function Topbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile Sidebar Toggle */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* System Identifier Badge */}
        <div className="flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
          <Zap className="size-3 text-teal-400" />

          <span className="text-sm font-medium text-slate-300">
            Servexa
          </span>
        </div>
      </div>
    </header>
  );
}