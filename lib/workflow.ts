import {
  CertificateStatus,
  RequestStatus,
  WorkflowStage,
} from "@/lib/enums";
import type { PipelineStage, StageState } from "@/lib/types";

export const PIPELINE_ORDER: PipelineStage[] = [
  "Submitted",
  "AI Draft",
  "Risk Scored",
  "Human Review",
  "Compliance Check",
  "Client Approval",
  "Trust Certificate",
];

const stageIndex: Record<WorkflowStage, number> = {
  SUBMITTED: 0,
  AI_DRAFT: 1,
  RISK_INTELLIGENCE: 2,
  HUMAN_REVIEW: 3,
  TERMINOLOGY_CHECK: 4,
  COMPLIANCE_APPROVAL: 5,
  TRUST_CERTIFICATE: 6,
};

export function workflowSteps(input: {
  currentStage: WorkflowStage;
  status: RequestStatus;
  certificateStatus: CertificateStatus;
  riskScore?: number | null;
}) {
  const activeIndex =
    input.status === RequestStatus.COMPLETED ||
    input.certificateStatus === CertificateStatus.ISSUED
      ? PIPELINE_ORDER.length
      : stageIndex[input.currentStage];

  return PIPELINE_ORDER.map((label, index) => {
    let state: StageState = "pending";
    if (index < activeIndex) state = "complete";
    if (index === activeIndex) state = "active";
    if (label === "Trust Certificate" && index > activeIndex) state = "locked";
    if (input.status === RequestStatus.COMPLETED) state = "complete";

    return {
      label,
      state,
      detail:
        label === "Risk Scored" && input.riskScore
          ? `${input.riskScore}/100`
          : undefined,
    };
  });
}

export function canGenerateAiDraft(status: RequestStatus) {
  return status === RequestStatus.SUBMITTED;
}

export function canRunRisk(status: RequestStatus) {
  return status === RequestStatus.AI_DRAFT_READY;
}

export function canSaveHumanFinal(status: RequestStatus) {
  const allowed: RequestStatus[] = [
    RequestStatus.RISK_SCORED,
    RequestStatus.HUMAN_REVIEW,
    RequestStatus.COMPLIANCE_CHECK,
  ];
  return allowed.includes(status);
}

export function canRunCompliance(status: RequestStatus) {
  const allowed: RequestStatus[] = [
    RequestStatus.HUMAN_REVIEW,
    RequestStatus.COMPLIANCE_CHECK,
  ];
  return allowed.includes(status);
}

export function canApproveFinal(status: RequestStatus) {
  return status === RequestStatus.COMPLIANCE_CHECK;
}

export function canGenerateCertificate(input: {
  status: RequestStatus;
  certificateStatus: CertificateStatus;
}) {
  return (
    input.status === RequestStatus.CLIENT_APPROVAL &&
    input.certificateStatus === CertificateStatus.READY
  );
}
