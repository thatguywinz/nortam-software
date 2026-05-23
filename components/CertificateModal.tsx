"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Award, Check, Download, X } from "lucide-react";
import { useEffect } from "react";
import { useAssure } from "@/lib/store";

export default function CertificateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { selectedDocument: doc } = useAssure();
  const issued = doc.certificateStatus === "Issued";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-shell-900/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-brand-gold/30 bg-white shadow-floating"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink-muted ring-1 ring-border hover:text-ink"
              aria-label="Close certificate"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative overflow-hidden bg-certificate p-10">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-gold/20 blur-3xl" />
              <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-brand-blue/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Seal />
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-brand-goldDeep">
                        Nortam Assure
                      </div>
                      <div className="font-serif text-xl text-ink">
                        Trust Certificate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Certificate ID
                    </div>
                    <div className="font-mono text-sm text-ink">
                      {doc.certificateId}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                    This is to certify that
                  </div>
                  <div className="mt-1 font-serif text-2xl text-ink">
                    {doc.title}
                  </div>
                  <div className="mt-1 text-sm text-ink-muted">
                    prepared for {doc.client}
                  </div>
                </div>

                <div className="mt-6 text-sm leading-relaxed text-ink/85">
                  has been translated with AI assistance, verified by certified
                  human reviewers, checked against client-approved terminology,
                  and approved under Nortam Assure’s defensible audit process.
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm md:grid-cols-3">
                  <Field label="Risk Level" value={`${doc.risk} · ${doc.riskScore}/100`} />
                  <Field label="Source" value={doc.sourceLanguage} />
                  <Field label="Target" value={doc.targetLanguage} />
                  <Field label="AI Draft" value="Complete" />
                  <Field label="Legal Review" value="Complete" />
                  <Field label="Compliance" value="Complete" />
                </dl>

                <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Final Approver
                    </div>
                    <div className="mt-1 font-serif text-lg text-ink">
                      Priya Shah
                    </div>
                    <div className="text-xs text-ink-muted">
                      Final Approver · Nortam Review Operations
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                      Issued
                    </div>
                    <div className="mt-1 font-serif text-lg text-ink">
                      {issued ? "23 May 2026" : "Awaiting issue"}
                    </div>
                    <div className="text-xs text-ink-muted">
                      Audit trail {doc.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border bg-white px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Cryptographically tied to audit trail · Tamper-evident
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-shell-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-shell-800"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Seal() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 ring-2 ring-brand-gold/40">
      <span className="absolute inset-1 rounded-full ring-1 ring-brand-gold/50" />
      <Award className="h-6 w-6 text-brand-goldDeep" />
    </div>
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
