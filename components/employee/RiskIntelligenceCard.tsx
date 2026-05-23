"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { riskBreakdown } from "@/lib/mockData";
import { useAssure } from "@/lib/store";

export default function RiskIntelligenceCard() {
  const { selectedDocument: doc } = useAssure();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="border-b border-border px-5 py-3.5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          Routing intelligence
        </div>
        <h2 className="font-serif text-lg text-ink">Risk Intelligence</h2>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Risk score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-4xl tracking-tight text-ink">
                {doc.riskScore}
              </span>
              <span className="text-sm text-ink-muted">/ 100</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">
            <ShieldAlert className="h-3 w-3" />
            High Risk
          </div>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${doc.riskScore}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-red-400 to-red-500"
          />
        </div>

        <div className="space-y-2.5 pt-1">
          {riskBreakdown.map((item, i) => {
            const pct = (item.value / item.max) * 100;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink">{item.label}</span>
                  <span className="font-mono text-ink-muted">
                    {item.value}/{item.max}
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      delay: 0.15 + i * 0.07,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-shell-800"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="border-t border-border pt-3 text-sm italic text-ink-muted">
          Nortam Assure routes work based on consequence, not just word count.
        </p>
        <p className="text-xs leading-relaxed text-ink">
          Low-risk content can move quickly through AI-assisted approval. High-
          risk work is routed to certified experts before it reaches the client.
        </p>
      </div>
    </motion.section>
  );
}
