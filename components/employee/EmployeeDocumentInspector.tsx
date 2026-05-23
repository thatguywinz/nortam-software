"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardCheck,
  FileSearch,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";
import RiskBadge from "../RiskBadge";
import StatusBadge from "../StatusBadge";

export default function EmployeeDocumentInspector({
  onOpenReview,
  onViewAudit,
}: {
  onOpenReview: () => void;
  onViewAudit: () => void;
}) {
  const { selectedDocument: doc, approveFinalReview } = useAssure();
  const approved = doc.approvalStatus === "Complete";
  const issued = doc.certificateStatus === "Issued";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="border-b border-border px-5 py-3.5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          Document Inspector
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mt-0.5 font-serif text-lg text-ink">{doc.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RiskBadge risk={doc.risk} />
              <StatusBadge tone="in-progress">{doc.status}</StatusBadge>
              <span className="text-[11px] text-ink-muted">
                Score {doc.riskScore}/100
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border px-5 py-4 text-sm">
        <Field label="Client" value={doc.client} />
        <Field label="Document type" value={doc.documentType} />
        <Field label="Source" value={doc.sourceLanguage} />
        <Field label="Target" value={doc.targetLanguage} />
        <Field
          label="AI first draft time"
          value={`${Math.floor(doc.aiDraftSeconds / 60)}m ${doc.aiDraftSeconds % 60}s`}
        />
        <Field label="Time saved" value={`${doc.timeSavedPct}%`} />
        <Field
          label="Reviewers required"
          value={doc.assignedTeam.join(", ")}
          full
        />
        <Field
          label="Certificate status"
          value={doc.certificateStatus}
          full
        />
      </dl>

      <div className="border-b border-border bg-amber-50/30 px-5 py-3 text-xs leading-relaxed text-ink">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
          Why flagged
        </div>
        <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
          {doc.reasonsFlagged.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 px-5 py-4">
        <button
          type="button"
          onClick={onOpenReview}
          className="inline-flex items-center gap-1.5 rounded-md bg-shell-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-shell-800"
        >
          <FileSearch className="h-3 w-3" />
          Open Review
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-ink hover:bg-slate-50"
        >
          <UserPlus className="h-3 w-3" />
          Assign Reviewer
        </button>
        <button
          type="button"
          onClick={onViewAudit}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-ink hover:bg-slate-50"
        >
          <ScrollText className="h-3 w-3" />
          View Audit Trail
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-ink hover:bg-slate-50"
        >
          <ShieldCheck className="h-3 w-3" />
          Run Compliance Check
        </button>
        <button
          type="button"
          onClick={approveFinalReview}
          disabled={approved}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
            approved
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-brand-blue text-white hover:bg-brand-blueDeep"
          )}
        >
          <ClipboardCheck className="h-3 w-3" />
          {approved ? "Final Review Approved" : "Approve Final Review"}
        </button>
        <button
          type="button"
          disabled={!approved || issued}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium",
            !approved
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : issued
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-brand-gold/15 text-brand-goldDeep ring-1 ring-brand-gold/40 hover:bg-brand-gold/20"
          )}
        >
          <Sparkles className="h-3 w-3" />
          {issued ? "Certificate Issued" : "Generate Certificate"}
        </button>
      </div>
    </motion.section>
  );
}

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={cn(full && "col-span-2")}>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
