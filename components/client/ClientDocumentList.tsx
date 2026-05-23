"use client";

import { motion } from "framer-motion";
import { ChevronRight, FileText, MessageSquare } from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";
import RiskBadge from "../RiskBadge";
import StatusBadge from "../StatusBadge";

const clientVisibleIds = [
  "NA-2026-0418",
  "NA-2026-0142",
  "NA-2026-0139",
  "NA-2026-0395",
];

export default function ClientDocumentList() {
  const { documents, selectDocument, selectedId } = useAssure();
  const list = documents.filter((d) => clientVisibleIds.includes(d.id));
  const primary = documents.find((d) => d.id === selectedId) ?? list[0];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel xl:col-span-3"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              Documents
            </div>
            <h2 className="font-serif text-lg text-ink">My Documents</h2>
          </div>
          <div className="text-xs text-ink-muted">
            {list.length} active · last updated 2 min ago
          </div>
        </div>
        <ul className="divide-y divide-border">
          {list.map((d, idx) => {
            const active = d.id === selectedId;
            const tone =
              d.status === "Completed"
                ? "complete"
                : d.status === "Awaiting approval"
                  ? "in-progress"
                  : d.status === "Compliance check"
                    ? "in-progress"
                    : "in-progress";
            return (
              <motion.li
                key={d.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.35 }}
              >
                <button
                  type="button"
                  onClick={() => selectDocument(d.id)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition",
                    active ? "bg-blue-50/40" : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md ring-1",
                        active
                          ? "bg-brand-blue/10 text-brand-blue ring-brand-blue/20"
                          : "bg-slate-50 text-slate-500 ring-slate-200"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-ink">
                        {d.title}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-muted">
                        <span>{d.sourceLanguage} → {d.targetLanguage}</span>
                        <span aria-hidden>·</span>
                        <span>Deadline {d.deadline}</span>
                        <span aria-hidden>·</span>
                        <span>Certificate {d.certificateStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <RiskBadge risk={d.risk} />
                    <StatusBadge tone={tone}>{d.status}</StatusBadge>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5",
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

      <motion.section
        key={primary.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel xl:col-span-2"
      >
        <div className="border-b border-border px-5 py-3.5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Document detail
          </div>
          <h3 className="font-serif text-lg text-ink">{primary.title}</h3>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm">
          <Row label="Request ID" value={primary.id} mono />
          <Row label="Risk level" value={`${primary.risk} (${primary.riskScore}/100)`} />
          <Row label="Current status" value={primary.status} />
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Assigned review team
            </div>
            <ul className="mt-1.5 space-y-1 text-sm text-ink">
              {primary.assignedTeam.map((m) => (
                <li key={m} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-slate-50 p-3 text-xs leading-relaxed text-ink">
            {primary.clientVisibleSummary}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border bg-slate-50/60 px-5 py-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-ink hover:bg-slate-50"
          >
            View Status
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-ink-muted hover:text-ink"
          >
            <MessageSquare className="h-3 w-3" />
            Message Review Team
          </button>
          <button
            type="button"
            disabled={primary.reviewStatus !== "Complete"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
              primary.reviewStatus === "Complete"
                ? "bg-shell-900 text-white hover:bg-shell-800"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            )}
          >
            Approve Final Translation
          </button>
          <button
            type="button"
            disabled={primary.certificateStatus !== "Issued"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
              primary.certificateStatus === "Issued"
                ? "bg-brand-gold/15 text-brand-goldDeep ring-1 ring-brand-gold/40 hover:bg-brand-gold/20"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            )}
          >
            Download Certificate
          </button>
        </div>
      </motion.section>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className={cn("text-sm text-ink", mono && "font-mono")}>{value}</div>
    </div>
  );
}
