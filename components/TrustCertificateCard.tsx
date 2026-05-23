"use client";

import { motion } from "framer-motion";
import { Award, FileCheck2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TrustCertificateCard({
  onPreview,
  onGenerate,
}: {
  onPreview: () => void;
  onGenerate: () => void;
}) {
  const { selectedDocument } = useAssure();
  const doc = selectedDocument;
  const issued = doc.certificateStatus === "Issued";
  const ready = doc.certificateStatus === "Ready" || issued;
  const canGenerate = doc.approvalStatus === "Complete" && !issued;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-panel"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-certificate opacity-90"
      />
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-gold/10 ring-1 ring-brand-gold/30">
              <Award className="h-5 w-5 text-brand-goldDeep" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Nortam Trust Certificate
              </div>
              <div className="font-serif text-lg text-ink">
                Certified human-verified translation review
              </div>
            </div>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
              issued
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : ready
                  ? "bg-brand-gold/10 text-brand-goldDeep ring-brand-gold/30"
                  : "bg-slate-100 text-slate-600 ring-slate-200"
            )}
          >
            {issued ? (
              <ShieldCheck className="h-3 w-3" />
            ) : ready ? (
              <Sparkles className="h-3 w-3" />
            ) : (
              <Lock className="h-3 w-3" />
            )}
            {issued
              ? "Issued"
              : ready
                ? "Ready to issue"
                : "Locked until approval"}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
          <Field label="Document" value={doc.title} />
          <Field label="Client" value={doc.client} />
          <Field label="Risk Level" value={`${doc.risk} (${doc.riskScore}/100)`} />
          <Field
            label="AI Draft Completed"
            value="Yes"
          />
          <Field
            label="Human Legal Review"
            value={doc.reviewStatus}
          />
          <Field label="Terminology Check" value={doc.terminologyStatus} />
          <Field label="Compliance Review" value={doc.complianceStatus} />
          <Field label="Audit Trail ID" value={doc.id} />
          <Field
            label="Certificate Status"
            value={
              issued
                ? "Issued"
                : ready
                  ? "Ready to issue"
                  : "Pending approval"
            }
          />
        </dl>

        <p className="mt-5 text-sm italic text-ink-muted">
          The certificate is not decoration. It is proof of process.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPreview}
            disabled={!ready}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition",
              ready
                ? "bg-shell-900 text-white hover:bg-shell-800"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            )}
          >
            <FileCheck2 className="h-4 w-4" />
            Preview Certificate
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition",
              canGenerate
                ? "border-brand-gold/40 bg-brand-gold/10 text-brand-goldDeep hover:bg-brand-gold/15"
                : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
            )}
          >
            <Sparkles className="h-4 w-4" />
            {issued ? "Certificate Issued" : "Generate Certificate"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
