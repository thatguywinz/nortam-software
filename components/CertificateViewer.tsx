"use client";

import { Award, Check, Download, FileCheck2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CertificateStatus } from "@/lib/enums";
import type { RequestView } from "@/lib/viewModels";
import { cn } from "@/lib/utils";

export default function CertificateViewer({
  requests,
}: {
  requests: RequestView[];
}) {
  const certificates = requests.filter((request) => request.certificate);
  const [selectedId, setSelectedId] = useState<string | null>(
    certificates[0]?.id ?? null
  );
  const selected =
    certificates.find((request) => request.id === selectedId) ?? null;

  return (
    <section
      id="certificates"
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Trust Layer
          </div>
          <h2 className="font-serif text-lg text-ink">Nortam Trust Certificates</h2>
        </div>
        <div className="rounded-full bg-brand-gold/10 px-2.5 py-1 text-[11px] font-medium text-brand-goldDeep ring-1 ring-brand-gold/30">
          Proof of process
        </div>
      </div>

      <ul className="divide-y divide-border">
        {requests.slice(0, 5).map((request) => {
          const issued = request.certificateStatus === CertificateStatus.ISSUED;
          return (
            <li key={request.id}>
              <button
                type="button"
                disabled={!issued}
                onClick={() => setSelectedId(request.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition",
                  issued ? "hover:bg-slate-50" : "cursor-not-allowed opacity-70"
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md ring-1",
                      issued
                        ? "bg-brand-gold/10 text-brand-goldDeep ring-brand-gold/30"
                        : "bg-slate-50 text-slate-400 ring-slate-200"
                    )}
                  >
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink">
                      {request.title}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-ink-muted">
                      {request.certificate?.certificateCode ?? "Certificate locked"}
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                    issued
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-100 text-slate-600 ring-slate-200"
                  )}
                >
                  {request.certificateStatus}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border bg-slate-50/70 px-5 py-3 text-[11px] text-ink-muted">
        The certificate is not decoration. It is proof of process.
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            className="absolute inset-0 bg-shell-900/70 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
            aria-label="Close certificate backdrop"
          />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-brand-gold/30 bg-white shadow-floating">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink-muted ring-1 ring-border hover:text-ink"
              aria-label="Close certificate"
            >
              <X className="h-4 w-4" />
            </button>
            <CertificateBody request={selected} />
            <div className="flex items-center justify-between gap-4 border-t border-border bg-white px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Audit trail captured and tied to workflow events
              </div>
              <Link
                href={`/certificates/${selected.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-shell-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-shell-800"
              >
                <Download className="h-3.5 w-3.5" />
                Print / Save PDF
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function CertificateBody({ request }: { request: RequestView }) {
  const certificate = request.certificate;
  return (
    <div className="relative overflow-hidden bg-certificate p-10">
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/15 ring-2 ring-brand-gold/40">
              <Award className="h-6 w-6 text-brand-goldDeep" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-brand-goldDeep">
                Nortam Assure
              </div>
              <div className="font-serif text-xl text-ink">Trust Certificate</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              Certificate ID
            </div>
            <div className="font-mono text-sm text-ink">
              {certificate?.certificateCode ?? "Pending"}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            This is to certify that
          </div>
          <div className="mt-1 font-serif text-2xl text-ink">{request.title}</div>
          <div className="mt-1 text-sm text-ink-muted">
            prepared for {request.organizationName}
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink/85">
          has been translated with AI assistance, verified by human reviewers,
          checked against client-approved terminology, and approved under
          Nortam Assure&apos;s defensible audit process.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm md:grid-cols-3">
          <Field label="Risk Level" value={`${request.riskLevel ?? "Pending"} · ${request.riskScore ?? "--"}/100`} />
          <Field label="Source" value={request.sourceLanguage} />
          <Field label="Target" value={request.targetLanguage} />
          <Field label="AI Draft" value="Complete" />
          <Field label="Human Review" value="Complete" />
          <Field label="Compliance" value="Complete" />
          <Field label="Audit Trail" value="Captured" />
          <Field label="Final Approver" value={request.finalApprovedBy ?? certificate?.issuedBy ?? "Nortam"} />
          <Field
            label="Issued"
            value={
              certificate?.issuedAt
                ? new Date(certificate.issuedAt).toLocaleString()
                : "Pending"
            }
          />
        </dl>

        <div className="mt-8 rounded-lg border border-brand-gold/30 bg-white/70 p-4 text-sm italic text-ink">
          The certificate is not decoration. It is proof of process.
        </div>
      </div>
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
