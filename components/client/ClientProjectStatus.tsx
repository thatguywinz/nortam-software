"use client";

import { motion } from "framer-motion";
import { MessageSquare, ShieldAlert } from "lucide-react";
import { useAssure } from "@/lib/store";
import WorkflowPipeline from "../WorkflowPipeline";
import RiskBadge from "../RiskBadge";
import StatusBadge from "../StatusBadge";
import type { PipelineStage } from "@/lib/types";

const ORDER: PipelineStage[] = [
  "Submitted",
  "AI Draft",
  "Risk Scored",
  "Human Review",
  "Compliance Check",
  "Client Approval",
  "Trust Certificate",
];

export default function ClientProjectStatus() {
  const { selectedDocument: doc } = useAssure();

  const steps = ORDER.map((label) => ({
    label,
    state: doc.pipeline[label],
    detail:
      label === "Risk Scored"
        ? doc.risk === "High"
          ? "High risk"
          : doc.risk === "Medium"
            ? "Medium risk"
            : "Low risk"
        : undefined,
  }));

  const tone =
    doc.certificateStatus === "Issued"
      ? "complete"
      : doc.approvalStatus === "Complete"
        ? "in-progress"
        : doc.reviewStatus === "Complete"
          ? "in-progress"
          : "in-progress";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Live Project Status
          </div>
          <h2 className="mt-0.5 font-serif text-lg text-ink">
            {doc.title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
            <span>Request ID · {doc.id}</span>
            <span aria-hidden>·</span>
            <span>Deadline {doc.deadline}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge risk={doc.risk} />
          <StatusBadge tone={tone}>{doc.status}</StatusBadge>
        </div>
      </div>

      <div className="px-5 py-6">
        <WorkflowPipeline steps={steps} />
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-border bg-slate-50/60 px-5 py-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            Why this is being reviewed by humans
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">
            {doc.clientVisibleSummary}
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-3">
          <div>
            <div className="text-xs text-ink-muted">Assigned review team</div>
            <ul className="mt-1.5 space-y-1 text-sm text-ink">
              {doc.assignedTeam.map((m) => (
                <li key={m} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-ink-muted hover:text-ink"
            >
              <MessageSquare className="h-3 w-3" />
              Message Review Team
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
