"use client";

import { motion } from "framer-motion";
import { Check, Clock, ScrollText } from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AuditTrail() {
  const { auditTrail } = useAssure();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="border-b border-border px-5 py-3.5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          Defensibility
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-lg text-ink">
            Defensible Audit Trail
          </h2>
        </div>
        <p className="mt-1 text-xs italic text-ink-muted">
          Every AI output, human edit, approval, and timestamp is captured.
        </p>
      </div>

      <ol className="relative px-5 py-4">
        <span
          aria-hidden
          className="absolute left-[26px] top-6 bottom-6 w-px bg-slate-200"
        />
        {auditTrail.map((event, i) => {
          const complete = event.status === "complete";
          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.3 }}
              className="relative flex items-start gap-3 py-2"
            >
              <div
                className={cn(
                  "relative z-10 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white",
                  complete
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {complete ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <Clock className="h-2.5 w-2.5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-sm text-ink">{event.action}</div>
                  <div className="font-mono text-[11px] text-ink-muted">
                    {event.time}
                  </div>
                </div>
                <div className="mt-0.5 text-xs text-ink-muted">
                  Actor · {event.actor}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2 border-t border-border bg-slate-50/60 px-5 py-3 text-xs text-ink-muted">
        <ScrollText className="h-3.5 w-3.5" />
        Trail is tied to the certificate ID and is exportable as a signed PDF.
      </div>
    </motion.section>
  );
}
