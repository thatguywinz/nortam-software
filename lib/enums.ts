export const UserRole = {
  CLIENT: "CLIENT",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RequestStatus = {
  SUBMITTED: "SUBMITTED",
  AI_DRAFT_READY: "AI_DRAFT_READY",
  RISK_SCORED: "RISK_SCORED",
  HUMAN_REVIEW: "HUMAN_REVIEW",
  COMPLIANCE_CHECK: "COMPLIANCE_CHECK",
  CLIENT_APPROVAL: "CLIENT_APPROVAL",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const WorkflowStage = {
  SUBMITTED: "SUBMITTED",
  AI_DRAFT: "AI_DRAFT",
  RISK_INTELLIGENCE: "RISK_INTELLIGENCE",
  HUMAN_REVIEW: "HUMAN_REVIEW",
  TERMINOLOGY_CHECK: "TERMINOLOGY_CHECK",
  COMPLIANCE_APPROVAL: "COMPLIANCE_APPROVAL",
  TRUST_CERTIFICATE: "TRUST_CERTIFICATE",
} as const;
export type WorkflowStage = (typeof WorkflowStage)[keyof typeof WorkflowStage];

export const DocumentRisk = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;
export type DocumentRisk = (typeof DocumentRisk)[keyof typeof DocumentRisk];

export const CertificateStatus = {
  LOCKED: "LOCKED",
  PENDING: "PENDING",
  READY: "READY",
  ISSUED: "ISSUED",
} as const;
export type CertificateStatus =
  (typeof CertificateStatus)[keyof typeof CertificateStatus];

export const VersionType = {
  SOURCE_EXTRACT: "SOURCE_EXTRACT",
  AI_DRAFT: "AI_DRAFT",
  HUMAN_FINAL: "HUMAN_FINAL",
} as const;
export type VersionType = (typeof VersionType)[keyof typeof VersionType];

export const CheckStatus = {
  PENDING: "PENDING",
  PASSED: "PASSED",
  FLAGGED: "FLAGGED",
  FAILED: "FAILED",
} as const;
export type CheckStatus = (typeof CheckStatus)[keyof typeof CheckStatus];

export const ReviewStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];
