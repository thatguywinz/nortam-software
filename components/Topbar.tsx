"use client";

import { Bell, ChevronDown, Search, ShieldCheck } from "lucide-react";
import { useAssure } from "@/lib/store";
import RoleSwitcher from "./RoleSwitcher";

export default function Topbar() {
  const { role } = useAssure();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-white/95 px-6 backdrop-blur">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder={
              role === "client"
                ? "Search requests, documents, certificates…"
                : "Search queue, clients, reviewers, audit IDs…"
            }
            className="h-9 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-blue/40 focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-ink-muted hover:text-ink md:inline-flex"
        >
          <span className="font-medium text-ink">
            {role === "client" ? "MapleBank Legal" : "Nortam Review Ops"}
          </span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 md:inline-flex">
        <ShieldCheck className="h-3 w-3" />
        Secure session active
      </div>

      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-ink-muted hover:text-ink"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-amber ring-2 ring-white" />
      </button>

      <RoleSwitcher />

      <div className="flex items-center gap-2.5">
        <div className="hidden text-right text-xs leading-tight md:block">
          <div className="font-medium text-ink">
            {role === "client" ? "Isabelle Tremblay" : "Priya Shah"}
          </div>
          <div className="text-ink-muted">
            {role === "client"
              ? "Senior Counsel · MapleBank"
              : "Final Approver · Nortam"}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-green text-xs font-semibold text-white ring-2 ring-white">
          {role === "client" ? "IT" : "PS"}
        </div>
      </div>
    </header>
  );
}
