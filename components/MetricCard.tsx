"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "gold" | "amber" | "red" | "ink";
  index?: number;
  suffix?: string;
};

const accentStyles: Record<NonNullable<Props["accent"]>, string> = {
  blue: "bg-brand-blue/10 text-brand-blue ring-brand-blue/20",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  gold: "bg-brand-gold/10 text-brand-goldDeep ring-brand-gold/30",
  amber: "bg-amber-50 text-amber-600 ring-amber-200",
  red: "bg-red-50 text-red-600 ring-red-200",
  ink: "bg-slate-100 text-ink ring-slate-200",
};

function useCountUp(target: number, durationMs = 1100, start = true) {
  const [val, setVal] = useState(start ? 0 : target);
  useEffect(() => {
    if (!start || typeof target !== "number" || !isFinite(target)) {
      setVal(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return val;
}

export default function MetricCard({
  label,
  value,
  delta,
  hint,
  icon,
  accent = "blue",
  index = 0,
  suffix,
}: Props) {
  const numeric = typeof value === "number" ? value : null;
  const displayed = useCountUp(numeric ?? 0, 1000, numeric !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 + index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative overflow-hidden rounded-xl border border-border bg-panel-card p-4 shadow-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <div className="font-serif text-3xl tracking-tight text-ink">
              {numeric !== null ? displayed : value}
              {suffix && <span className="text-ink-muted">{suffix}</span>}
            </div>
            {delta && (
              <div className="text-xs font-medium text-emerald-600">{delta}</div>
            )}
          </div>
          {hint && (
            <div className="mt-1 text-xs text-ink-muted">{hint}</div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
              accentStyles[accent]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
