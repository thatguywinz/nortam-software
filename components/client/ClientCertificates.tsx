"use client";

import { motion } from "framer-motion";
import { Award, ChevronRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ClientCertificates({
  onPreview,
}: {
  onPreview: () => void;
}) {
  const { documents, selectDocument } = useAssure();
  const list = documents
    .filter((d) =>
      ["NA-2026-0139", "NA-2026-0142", "NA-2026-0418"].includes(d.id)
    )
    .sort((a, b) => a.title.localeCompare(b.title));

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
            Trust Layer
          </div>
          <h2 className="font-serif text-lg text-ink">Nortam Trust Certificates</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 px-2.5 py-1 text-[11px] text-brand-goldDeep ring-1 ring-brand-gold/30">
          <ShieldCheck className="h-3 w-3" />
          Tamper-evident
        </div>
      </div>
      <ul className="divide-y divide-border">
        {list.map((d, i) => {
          const issued = d.certificateStatus === "Issued";
          const ready = d.certificateStatus === "Ready";
          const accessible = issued || ready;
          return (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
            >
              <button
                type="button"
                disabled={!accessible}
                onClick={() => {
                  selectDocument(d.id);
                  if (accessible) onPreview();
                }}
                className={cn(
                  "group flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition",
                  accessible ? "hover:bg-slate-50" : "cursor-not-allowed"
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md ring-1",
                      issued
                        ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                        : ready
                          ? "bg-brand-gold/10 text-brand-goldDeep ring-brand-gold/30"
                          : "bg-slate-50 text-slate-400 ring-slate-200"
                    )}
                  >
                    {issued ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : ready ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink">
                      {d.title}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-ink-muted">
                      {d.certificateId}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                      issued
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : ready
                          ? "bg-brand-gold/10 text-brand-goldDeep ring-brand-gold/30"
                          : "bg-slate-100 text-slate-500 ring-slate-200"
                    )}
                  >
                    {d.certificateStatus}
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition",
                      accessible
                        ? "text-slate-400 group-hover:translate-x-0.5"
                        : "text-slate-300"
                    )}
                  />
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
      <div className="flex items-center gap-2 border-t border-border bg-slate-50/60 px-5 py-3 text-[11px] text-ink-muted">
        <Award className="h-3.5 w-3.5 text-brand-goldDeep" />
        The certificate is not decoration. It is proof of process.
      </div>
    </motion.section>
  );
}
