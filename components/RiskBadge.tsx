"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { DocumentRisk } from "@/lib/types";
import { cn } from "@/lib/utils";

const map: Record<
  DocumentRisk,
  { className: string; icon: React.ReactNode; label: string }
> = {
  High: {
    className: "bg-red-50 text-red-700 ring-red-200",
    icon: <ShieldAlert className="h-3 w-3" />,
    label: "High risk",
  },
  Medium: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: <AlertTriangle className="h-3 w-3" />,
    label: "Medium risk",
  },
  Low: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: <ShieldCheck className="h-3 w-3" />,
    label: "Low risk",
  },
};

export default function RiskBadge({
  risk,
  className,
}: {
  risk: DocumentRisk;
  className?: string;
}) {
  const item = map[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
        item.className,
        className
      )}
    >
      {item.icon}
      {item.label}
    </span>
  );
}
