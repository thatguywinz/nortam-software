import {
  CertificateStatus,
  CheckStatus,
  DocumentRisk,
  RequestStatus,
  ReviewStatus,
  WorkflowStage,
} from "@/lib/enums";

export function titleCaseEnum(value?: string | null) {
  if (!value) return "Not set";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function riskLabel(risk?: DocumentRisk | null) {
  if (risk === DocumentRisk.HIGH) return "High";
  if (risk === DocumentRisk.MEDIUM) return "Medium";
  if (risk === DocumentRisk.LOW) return "Low";
  return "Medium";
}

export function certificateLabel(status: CertificateStatus) {
  return titleCaseEnum(status);
}

export function reviewLabel(status: ReviewStatus) {
  return titleCaseEnum(status);
}

export function statusLabel(status: RequestStatus) {
  return titleCaseEnum(status);
}

export function checkLabel(status?: CheckStatus | null) {
  return titleCaseEnum(status);
}

export function stageLabel(stage: WorkflowStage) {
  return titleCaseEnum(stage);
}

export function formatDateTime(value?: Date | string | null) {
  if (!value) return "Not scheduled";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
