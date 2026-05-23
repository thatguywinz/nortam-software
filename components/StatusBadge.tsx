"use client";

import { Check, Clock, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "complete"
  | "in-progress"
  | "pending"
  | "locked"
  | "neutral"
  | "warning"
  | "success";

const toneStyles: Record<Tone, string> = {
  complete: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "in-progress": "bg-blue-50 text-blue-700 ring-blue-200",
  pending: "bg-slate-100 text-slate-600 ring-slate-200",
  locked: "bg-slate-100 text-slate-500 ring-slate-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const toneIcon: Partial<Record<Tone, React.ReactNode>> = {
  complete: <Check className="h-3 w-3" />,
  "in-progress": <Loader2 className="h-3 w-3 animate-spin" />,
  pending: <Clock className="h-3 w-3" />,
  locked: <Lock className="h-3 w-3" />,
};

export default function StatusBadge({
  tone = "neutral",
  children,
  withIcon = true,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  withIcon?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
        toneStyles[tone],
        className
      )}
    >
      {withIcon && toneIcon[tone]}
      {children}
    </span>
  );
}
