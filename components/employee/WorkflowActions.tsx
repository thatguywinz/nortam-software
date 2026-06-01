"use client";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  assignReviewerAction,
  approveFinalReviewAction,
  generateAiDraftAction,
  generateCertificateAction,
  markLegalReviewCompleteAction,
  runComplianceCheckAction,
  runRiskScoringAction,
} from "@/lib/actions";
import {
  canApproveFinal,
  canGenerateAiDraft,
  canGenerateCertificate,
  canRunCompliance,
  canRunRisk,
} from "@/lib/workflow";
import { CheckStatus, VersionType } from "@/lib/enums";
import type { RequestView } from "@/lib/viewModels";
import { cn } from "@/lib/utils";

export default function WorkflowActions({ request }: { request: RequestView }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null
  );
  const hasFinal = request.versions.some(
    (version) => version.type === VersionType.HUMAN_FINAL
  );
  const latestCheck = request.complianceChecks[0];
  const compliancePassed = latestCheck?.status === CheckStatus.PASSED;

  const run = (
    action: () => Promise<{ ok: boolean; message?: string; error?: string }>
  ) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await action();
      setFeedback({
        ok: result.ok,
        text: result.ok
          ? result.message ?? "Done."
          : result.error ?? "Action failed.",
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Action
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="Generate AI Draft"
          disabled={pending || !canGenerateAiDraft(request.status)}
          disabledReason="Available after submission."
          onClick={() => run(() => generateAiDraftAction(request.id))}
        />
        <Action
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          label="Run Risk Scoring"
          disabled={pending || !canRunRisk(request.status)}
          disabledReason="Generate an AI draft first."
          onClick={() => run(() => runRiskScoringAction(request.id))}
        />
        <Action
          icon={<UserPlus className="h-3.5 w-3.5" />}
          label={request.assignments.length ? "Team Assigned" : "Assign Reviewer"}
          disabled={pending}
          onClick={() => run(() => assignReviewerAction(request.id))}
        />
        <Link
          href={`${pathname}?view=review`}
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-slate-50"
        >
          <FileSearch className="h-3.5 w-3.5" />
          Open Review
        </Link>
        <Action
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          label="Run Compliance Check"
          disabled={pending || !hasFinal || !canRunCompliance(request.status)}
          disabledReason="Save a human final first."
          onClick={() => run(() => runComplianceCheckAction(request.id))}
        />
        <Action
          icon={<ClipboardCheck className="h-3.5 w-3.5" />}
          label={request.legalReviewAt ? "Legal Review Complete" : "Mark Legal Review Complete"}
          disabled={pending || !hasFinal}
          disabledReason="Save a human final first."
          onClick={() => run(() => markLegalReviewCompleteAction(request.id))}
        />
        <Action
          icon={<ClipboardCheck className="h-3.5 w-3.5" />}
          label="Approve Final Review"
          disabled={
            pending ||
            !canApproveFinal(request.status) ||
            !request.legalReviewAt ||
            !compliancePassed
          }
          disabledReason="Requires legal review complete and passed compliance."
          onClick={() => run(() => approveFinalReviewAction(request.id))}
          primary
        />
        <Action
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="Generate Certificate"
          disabled={
            pending ||
            !canGenerateCertificate({
              status: request.status,
              certificateStatus: request.certificateStatus,
            })
          }
          disabledReason="Requires final approval."
          onClick={() => run(() => generateCertificateAction(request.id))}
          gold
        />
      </div>
      {pending && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-brand-blue">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Working…
        </div>
      )}
      {!pending && feedback && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
            feedback.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {feedback.ok ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          {feedback.text}
        </div>
      )}
    </div>
  );
}

function Action({
  icon,
  label,
  disabled,
  disabledReason,
  onClick,
  primary,
  gold,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
  onClick: () => void;
  primary?: boolean;
  gold?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition",
        primary && !disabled
          ? "bg-brand-blue text-white hover:bg-brand-blueDeep"
          : gold && !disabled
            ? "bg-brand-gold/15 text-brand-goldDeep ring-1 ring-brand-gold/40 hover:bg-brand-gold/20"
            : disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "border border-border bg-white text-ink hover:bg-slate-50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
