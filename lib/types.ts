export type UserRole = "client" | "employee";

export type DocumentRisk = "Low" | "Medium" | "High";

export type CertificateStatus = "Locked" | "Pending" | "Ready" | "Issued";

export type ReviewStatus = "Not Started" | "In Progress" | "Complete";

export type PipelineStage =
  | "Submitted"
  | "AI Draft"
  | "Risk Scored"
  | "Human Review"
  | "Compliance Check"
  | "Client Approval"
  | "Trust Certificate";

export type StageState = "complete" | "active" | "pending" | "locked";

export type TranslationDocument = {
  id: string;
  title: string;
  client: string;
  documentType: string;
  industry: string;
  sourceLanguage: string;
  targetLanguage: string;
  risk: DocumentRisk;
  riskScore: number;
  status: string;
  deadline: string;
  confidence: number;
  certificateStatus: CertificateStatus;
  certificateId: string;
  reviewStatus: ReviewStatus;
  approvalStatus: ReviewStatus;
  complianceStatus: ReviewStatus;
  terminologyStatus: ReviewStatus;
  aiDraftSeconds: number;
  timeSavedPct: number;
  reasonsFlagged: string[];
  assignedTeam: string[];
  clientVisibleSummary: string;
  pipeline: Record<PipelineStage, StageState>;
};

export type AuditEvent = {
  id: string;
  time: string;
  actor: string;
  action: string;
  status: "complete" | "pending";
};

export type GlossaryEntry = {
  english: string;
  approved: string;
};
