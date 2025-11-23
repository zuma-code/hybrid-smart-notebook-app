"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-2">
        <h2 className="text-lg font-semibold">Hybrid Smart Notebook</h2>
      </div>
    </header>
  );
}






