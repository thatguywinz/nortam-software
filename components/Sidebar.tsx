"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Bookmark,
  ClipboardCheck,
  ClipboardList,
  Command,
  FileCheck2,
  FileText,
  Files,
  Gauge,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";

type NavItem = { label: string; icon: React.ComponentType<{ className?: string }>; key: string };

const clientNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, key: "overview" },
  { label: "New Request", icon: Send, key: "new" },
  { label: "My Documents", icon: Files, key: "docs" },
  { label: "Project Status", icon: Activity, key: "status" },
  { label: "Approvals", icon: ClipboardCheck, key: "approvals" },
  { label: "Certificates", icon: Award, key: "certs" },
  { label: "Messages", icon: MessageSquare, key: "messages" },
  { label: "Account Settings", icon: Settings, key: "settings" },
];

const employeeNav: NavItem[] = [
  { label: "Command Center", icon: Command, key: "command" },
  { label: "Incoming Requests", icon: Inbox, key: "incoming" },
  { label: "Risk Queue", icon: ShieldAlert, key: "risk" },
  { label: "AI Drafts", icon: Sparkles, key: "drafts" },
  { label: "Human Review", icon: ClipboardList, key: "review" },
  { label: "Terminology", icon: Bookmark, key: "terminology" },
  { label: "Compliance", icon: ShieldCheck, key: "compliance" },
  { label: "Audit Trail", icon: FileText, key: "audit" },
  { label: "Certificates", icon: FileCheck2, key: "certs" },
  { label: "Client Portal View", icon: Workflow, key: "client-preview" },
];

function NortamMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="nm-side" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#nm-side)" />
      <path
        d="M12 27V13l16 14V13"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Sidebar() {
  const { role } = useAssure();
  const items = role === "client" ? clientNav : employeeNav;
  const [active, setActive] = useState(items[0].key);

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-white/5 bg-shell-900 text-white/85 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <NortamMark />
        <div className="leading-tight">
          <div className="font-serif text-[15px] tracking-tight text-white">
            Nortam <span className="text-brand-gold">Assure</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
            {role === "client" ? "Client Workspace" : "Review Operations"}
          </div>
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            Workspace
          </div>
          <div className="mt-0.5 truncate text-sm text-white/90">
            {role === "client" ? "MapleBank Legal" : "Nortam Review Operations"}
          </div>
        </div>
      </div>

      <nav className="mt-2 flex-1 px-2">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActive(item.key)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "text-white"
                      : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.04] ring-1 ring-white/5">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="relative">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2 text-[11px] text-white/55">
          {role === "client" ? (
            <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
          ) : (
            <Gauge className="h-3.5 w-3.5 text-brand-gold" />
          )}
          <span className="uppercase tracking-[0.18em]">
            {role === "client" ? "Secure Client Portal" : "Nortam Internal"}
          </span>
        </div>
        <div className="mt-1 text-[12px] leading-relaxed text-white/55">
          {role === "client"
            ? "Encrypted document workspace"
            : "Human-verified workflow"}
        </div>
      </div>
    </aside>
  );
}
