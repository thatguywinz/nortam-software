"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Award,
  ClipboardList,
  Command,
  FileText,
  Files,
  Gauge,
  Inbox,
  LayoutDashboard,
  ScrollText,
  Send,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UserRole } from "@/lib/enums";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  base: string;
  view?: string;
};

const clientNav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, base: "/client", view: "overview" },
  { label: "New Request", icon: Send, base: "/client", view: "new" },
  { label: "My Documents", icon: Files, base: "/client", view: "documents" },
  { label: "Certificates", icon: Award, base: "/client", view: "certificates" },
  { label: "Activity", icon: Activity, base: "/client", view: "activity" },
];

const employeeNav: NavItem[] = [
  { label: "Command Center", icon: Command, base: "/employee", view: "overview" },
  { label: "Incoming Requests", icon: Inbox, base: "/employee", view: "queue" },
  { label: "Human Review", icon: ClipboardList, base: "/employee", view: "review" },
  { label: "Risk Intelligence", icon: ShieldAlert, base: "/employee", view: "risk" },
  { label: "Terminology", icon: ShieldCheck, base: "/employee", view: "terminology" },
  { label: "Certificates", icon: Award, base: "/employee", view: "certificate" },
  { label: "Audit Trail", icon: ScrollText, base: "/employee", view: "audit" },
  { label: "Client Portal View", icon: FileText, base: "/client" },
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

export default function Sidebar({
  role,
  workspace,
}: {
  role: UserRole;
  workspace: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const items = role === UserRole.CLIENT ? clientNav : employeeNav;
  const currentView = params.get("view") ?? "overview";

  const hrefFor = (item: NavItem) =>
    item.view ? `${item.base}?view=${item.view}` : item.base;

  const isActiveItem = (item: NavItem) => {
    if (!pathname.startsWith(item.base)) return false;
    if (!item.view) return false;
    return currentView === item.view;
  };

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-white/5 bg-shell-900 text-white/85 lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <NortamMark />
        <div className="leading-tight">
          <div className="font-serif text-[15px] tracking-tight text-white">
            Nortam <span className="text-brand-gold">Assure</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">
            {role === UserRole.CLIENT ? "Client Workspace" : "Review Operations"}
          </div>
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            Workspace
          </div>
          <div className="mt-0.5 truncate text-sm text-white/90">
            {workspace}
          </div>
        </div>
      </div>

      <nav className="mt-2 flex-1 px-2">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);
            return (
              <li key={item.label}>
                <Link
                  href={hrefFor(item)}
                  scroll={false}
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2 text-[11px] text-white/55">
          {role === UserRole.CLIENT ? (
            <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
          ) : (
            <Gauge className="h-3.5 w-3.5 text-brand-gold" />
          )}
          <span className="uppercase tracking-[0.18em]">
            {role === UserRole.CLIENT ? "Secure Client Portal" : "Nortam Internal"}
          </span>
        </div>
        <div className="mt-1 text-[12px] leading-relaxed text-white/55">
          {role === UserRole.CLIENT
            ? "Encrypted document workspace"
            : "Human-verified workflow"}
        </div>
      </div>
    </aside>
  );
}
