"use client";

import { motion } from "framer-motion";
import { Check, FileText, MessageSquare, Sparkles, UserCheck } from "lucide-react";
import { reviewerComments } from "@/lib/mockData";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";
import StatusBadge from "../StatusBadge";

function statusTone(s: string) {
  if (s === "Complete") return "complete" as const;
  if (s === "In Progress") return "in-progress" as const;
  return "pending" as const;
}

const AI_TEXT = [
  { text: "Le client doit ", tag: null },
  { text: "comprendre", tag: "old" },
  { text: " ", tag: null },
  { text: "tous les frais", tag: "old" },
  { text: " avant de signer ", tag: null },
  { text: "l’accord", tag: "old" },
  { text: ".", tag: null },
];

const HUMAN_TEXT = [
  { text: "Le client doit ", tag: null },
  { text: "prendre connaissance", tag: "new" },
  { text: " de ", tag: null },
  { text: "l’ensemble des frais applicables", tag: "new" },
  { text: " avant de signer ", tag: null },
  { text: "la convention", tag: "new" },
  { text: ".", tag: null },
];

export default function ReviewWorkspace() {
  const {
    selectedDocument: doc,
    markLegalReviewComplete,
  } = useAssure();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="border-b border-border px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              Human-in-the-Loop Review
            </div>
            <h2 className="font-serif text-lg text-ink">
              Side-by-side comparison
            </h2>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] text-brand-blue ring-1 ring-blue-200 md:inline-flex">
            <UserCheck className="h-3 w-3" />
            Amira Chen · Certified Legal Translator
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] md:grid-cols-4">
          <StatusBadge tone={statusTone("Complete")}>AI Draft</StatusBadge>
          <StatusBadge tone={statusTone(doc.reviewStatus)}>
            Legal Review · {doc.reviewStatus}
          </StatusBadge>
          <StatusBadge tone={statusTone(doc.complianceStatus)}>
            Compliance · {doc.complianceStatus}
          </StatusBadge>
          <StatusBadge tone={statusTone(doc.approvalStatus)}>
            Final Approval · {doc.approvalStatus}
          </StatusBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <Pane
          tone="ai"
          title="AI First Draft"
          icon={<Sparkles className="h-3.5 w-3.5" />}
          subtitle="Generated 09:16 AM · Nortam Assure AI"
        >
          <p className="font-serif text-[15px] leading-relaxed text-ink/90">
            {AI_TEXT.map((part, i) => (
              <span
                key={i}
                className={cn(
                  part.tag === "old" &&
                    "rounded bg-red-100/70 px-1 text-red-700 line-through decoration-red-400/70"
                )}
              >
                {part.text}
              </span>
            ))}
          </p>
        </Pane>
        <Pane
          tone="human"
          title="Human-Verified Final"
          icon={<UserCheck className="h-3.5 w-3.5" />}
          subtitle="Edited 09:21 AM · Amira Chen"
        >
          <p className="font-serif text-[15px] leading-relaxed text-ink">
            {HUMAN_TEXT.map((part, i) => (
              <span
                key={i}
                className={cn(
                  part.tag === "new" &&
                    "rounded bg-emerald-100/70 px-1 text-emerald-800 underline decoration-emerald-500/60 underline-offset-2"
                )}
              >
                {part.text}
              </span>
            ))}
          </p>
        </Pane>
      </div>

      <div className="border-t border-border bg-slate-50/60 px-5 py-4">
        <div className="flex items-start gap-2 text-xs text-ink">
          <FileText className="mt-0.5 h-3.5 w-3.5 text-brand-blue" />
          <div>
            <div className="font-medium text-ink">Reviewer note</div>
            <div className="mt-0.5 text-ink-muted">
              Adjusted for formal Quebec French legal phrasing and
              client-approved disclosure terminology.
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {reviewerComments.map((c) => (
            <div
              key={c.role}
              className="flex items-start gap-3 rounded-lg border border-border bg-white px-3 py-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shell-900 text-[11px] font-medium text-white">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span>·</span>
                  <span>{c.role}</span>
                </div>
                <div className="mt-0.5 text-ink">{c.note}</div>
              </div>
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-ink-muted">
            Highlights show where the human reviewer overrode the AI draft.
          </div>
          <button
            type="button"
            onClick={markLegalReviewComplete}
            disabled={doc.reviewStatus === "Complete"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
              doc.reviewStatus === "Complete"
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-shell-900 text-white hover:bg-shell-800"
            )}
          >
            <Check className="h-3 w-3" />
            {doc.reviewStatus === "Complete"
              ? "Legal Review Complete"
              : "Mark Legal Review Complete"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function Pane({
  tone,
  title,
  icon,
  subtitle,
  children,
}: {
  tone: "ai" | "human";
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-border px-5 py-4 md:border-r",
        tone === "ai" ? "bg-white" : "bg-slate-50/50"
      )}
    >
      <div className="flex items-center gap-2 text-xs">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md ring-1",
            tone === "ai"
              ? "bg-blue-50 text-brand-blue ring-blue-200"
              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
          )}
        >
          {icon}
        </div>
        <div>
          <div className="font-medium text-ink">{title}</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
