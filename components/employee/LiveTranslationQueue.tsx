"use client";

import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";
import RiskBadge from "../RiskBadge";

const QUEUE_IDS = [
  "NA-2026-0418",
  "NA-2026-0139",
  "NA-2026-0411",
  "NA-2026-0406",
  "NA-2026-0142",
];

export default function LiveTranslationQueue() {
  const { documents, selectDocument, selectedId } = useAssure();
  const list = QUEUE_IDS.map((id) =>
    documents.find((d) => d.id === id)
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Operations
          </div>
          <h2 className="font-serif text-lg text-ink">Live Translation Queue</h2>
        </div>
        <div className="text-xs text-ink-muted">{list.length} active</div>
      </div>
      <div className="grid grid-cols-12 gap-2 border-b border-border bg-slate-50/60 px-5 py-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        <div className="col-span-5">Document</div>
        <div className="col-span-2">Pair</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Risk</div>
        <div className="col-span-1 text-right">Conf.</div>
        <div className="col-span-1 text-right">SLA</div>
      </div>
      <ul className="divide-y divide-border">
        {list.map((d, idx) => {
          const active = d.id === selectedId;
          return (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * idx, duration: 0.35 }}
            >
              <button
                type="button"
                onClick={() => selectDocument(d.id)}
                className={cn(
                  "group grid w-full grid-cols-12 items-center gap-2 px-5 py-3 text-left text-sm transition",
                  active ? "bg-blue-50/40" : "hover:bg-slate-50"
                )}
              >
                <div className="col-span-5 min-w-0">
                  <div className="flex items-center gap-2">
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    )}
                    <div className="truncate font-medium text-ink">
                      {d.title}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    {d.client}
                  </div>
                </div>
                <div className="col-span-2 text-xs text-ink">
                  {d.sourceLanguage} → {d.targetLanguage}
                </div>
                <div className="col-span-2 text-xs text-ink">{d.status}</div>
                <div className="col-span-1">
                  <RiskBadge risk={d.risk} className="px-1.5 py-[1px]" />
                </div>
                <div className="col-span-1 text-right font-mono text-xs text-ink">
                  {d.confidence}%
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1 text-xs text-ink-muted">
                  <Clock className="h-3 w-3" />
                  {d.deadline}
                </div>
                <div className="col-span-12 flex justify-end">
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5",
                      active && "text-brand-blue"
                    )}
                  />
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
