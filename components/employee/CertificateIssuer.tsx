"use client";

import { Award, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CertificateStatus } from "@/lib/enums";
import { generateCertificateAction } from "@/lib/actions";
import { canGenerateCertificate } from "@/lib/workflow";
import type { RequestView } from "@/lib/viewModels";
import { cn } from "@/lib/utils";

export default function CertificateIssuer({ request }: { request: RequestView }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const issued = request.certificateStatus === CertificateStatus.ISSUED;
  const canGenerate = canGenerateCertificate({
    status: request.status,
    certificateStatus: request.certificateStatus,
  });

  return (
    <section
      id="certificate"
      className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-panel"
    >
      <div aria-hidden className="absolute inset-0 bg-certificate opacity-90" />
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
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
              issued
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : canGenerate
                  ? "bg-brand-gold/10 text-brand-goldDeep ring-brand-gold/30"
                  : "bg-slate-100 text-slate-600 ring-slate-200"
            )}
          >
            {request.certificateStatus}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
          <Field label="Document" value={request.title} />
          <Field label="Client" value={request.organizationName} />
          <Field label="Risk Level" value={`${request.riskLevel ?? "Pending"} (${request.riskScore ?? "--"}/100)`} />
          <Field label="AI Draft Completed" value={request.versions.some((v) => v.type === "AI_DRAFT") ? "Yes" : "No"} />
          <Field label="Human Legal Review" value={request.legalReviewAt ? "Complete" : "Pending"} />
          <Field label="Compliance Review" value={request.complianceChecks[0]?.status ?? "Pending"} />
          <Field label="Audit Trail" value={`${request.auditEvents.length} events`} />
          <Field
            label="Certificate ID"
            value={request.certificate?.certificateCode ?? "Not issued"}
          />
          <Field
            label="Final Approver"
            value={request.finalApprovedBy ?? "Pending"}
          />
        </dl>

        <p className="mt-5 text-sm italic text-ink-muted">
          The certificate is not decoration. It is proof of process.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending || !canGenerate}
            onClick={() => {
              setMessage("");
              startTransition(async () => {
                const result = await generateCertificateAction(request.id);
                setMessage(result.ok ? result.message ?? "Issued." : result.error);
                router.refresh();
              });
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition",
              canGenerate
                ? "bg-brand-gold/15 text-brand-goldDeep ring-1 ring-brand-gold/40 hover:bg-brand-gold/20"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            )}
          >
            <Sparkles className="h-4 w-4" />
            Generate Certificate
          </button>
          {issued && (
            <Link
              href={`/certificates/${request.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-shell-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-shell-800"
            >
              <Award className="h-4 w-4" />
              Open Certificate
            </Link>
          )}
        </div>
        {message && (
          <div className="mt-3 rounded-lg border border-border bg-white/80 px-3 py-2 text-xs text-ink-muted">
            {message}
          </div>
        )}
      </div>
    </section>
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
