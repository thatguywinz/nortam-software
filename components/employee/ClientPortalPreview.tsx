"use client";

import { motion } from "framer-motion";
import { Eye, Loader2 } from "lucide-react";
import { useAssure } from "@/lib/store";

export default function ClientPortalPreview() {
  const { selectedDocument: doc } = useAssure();

  const status = doc.certificateStatus === "Issued"
    ? "Trust certificate issued"
    : doc.approvalStatus === "Complete"
      ? "Awaiting certificate issue"
      : doc.complianceStatus === "In Progress"
        ? "Compliance check in progress"
        : doc.reviewStatus === "Complete"
          ? "Compliance check pending"
          : "Human legal review in progress";

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
            Operational empathy
          </div>
          <h2 className="font-serif text-base text-ink">
            Client-facing status preview
          </h2>
        </div>
        <Eye className="h-4 w-4 text-ink-muted" />
      </div>
      <div className="space-y-3 px-5 py-4">
        <div className="rounded-lg border border-border bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Loader2 className="h-3 w-3 animate-spin text-brand-blue" />
            What MapleBank Legal sees now
          </div>
          <div className="mt-1 font-medium text-ink">{status}</div>
        </div>
        <p className="text-xs leading-relaxed text-ink">
          Your document has been classified as high risk due to regulated
          financial disclosure language. Nortam’s legal review team is verifying
          terminology and compliance before final approval.
        </p>
      </div>
    </motion.section>
  );
}
