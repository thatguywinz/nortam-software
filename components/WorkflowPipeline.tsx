"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Lock } from "lucide-react";
import type { PipelineStage, StageState } from "@/lib/types";
import { cn } from "@/lib/utils";

type Step = {
  label: PipelineStage;
  state: StageState;
  detail?: string;
};

export default function WorkflowPipeline({
  steps,
  compact = false,
}: {
  steps: Step[];
  compact?: boolean;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-0 right-0 top-[18px] hidden h-px bg-slate-200 md:block"
      />
      <ol
        className={cn(
          "grid grid-cols-1 gap-3 md:grid-cols-7 md:gap-2",
          compact && "md:gap-1"
        )}
      >
        {steps.map((step, i) => (
          <motion.li
            key={step.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
            className="relative flex flex-col items-start gap-2 md:items-center md:text-center"
          >
            <StepDot state={step.state} />
            <div className="md:px-1">
              <div
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.08em]",
                  step.state === "complete"
                    ? "text-emerald-700"
                    : step.state === "active"
                      ? "text-brand-blue"
                      : step.state === "locked"
                        ? "text-slate-400"
                        : "text-ink-muted"
                )}
              >
                {step.label}
              </div>
              {step.detail && (
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {step.detail}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function StepDot({ state }: { state: StageState }) {
  const base =
    "relative z-10 flex h-9 w-9 items-center justify-center rounded-full ring-1 bg-white";
  if (state === "complete") {
    return (
      <div className={cn(base, "ring-emerald-300 bg-emerald-50 text-emerald-600")}>
        <Check className="h-4 w-4" />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="relative">
        <span className="absolute inset-0 -m-1 rounded-full bg-brand-blue/15 animate-pulse-soft" />
        <div className={cn(base, "ring-brand-blue bg-white text-brand-blue")}>
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }
  if (state === "locked") {
    return (
      <div className={cn(base, "ring-slate-200 text-slate-400")}>
        <Lock className="h-3.5 w-3.5" />
      </div>
    );
  }
  return (
    <div className={cn(base, "ring-slate-200 text-slate-400")}>
      <span className="h-2 w-2 rounded-full bg-slate-300" />
    </div>
  );
}
