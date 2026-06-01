import type {
  CertificateStatus,
  CheckStatus,
  DocumentRisk,
  RequestStatus,
  ReviewStatus,
  VersionType,
  WorkflowStage,
} from "@/lib/enums";

export type VersionView = {
  id: string;
  type: VersionType;
  content: string;
  language: string;
  createdBy: string;
  notes: string | null;
  createdAt: string;
};

export type RequestView = {
  id: string;
  requestCode: string;
  title: string;
  organizationName: string;
  organizationId: string;
  terminology: Array<{
    id: string;
    sourceTerm: string;
    approvedTerm: string;
    targetLanguage: string;
    notes: string | null;
  }>;
  documentType: string;
  industry: string;
  sourceLanguage: string;
  targetLanguage: string;
  deadline: string | null;
  confidentialityLevel: string;
  riskExpectation: string;
  requiredReviewLevel: string;
  specialInstructions: string | null;
  status: RequestStatus;
  currentStage: WorkflowStage;
  riskLevel: DocumentRisk | null;
  riskScore: number | null;
  aiConfidence: number | null;
  certificateStatus: CertificateStatus;
  legalReviewAt: string | null;
  finalApprovedAt: string | null;
  finalApprovedBy: string | null;
  createdAt: string;
  updatedAt: string;
  assets: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  }>;
  versions: VersionView[];
  assignments: Array<{
    id: string;
    reviewerName: string;
    reviewerRole: string;
    status: ReviewStatus;
  }>;
  riskAssessment: null | {
    totalScore: number;
    riskLevel: DocumentRisk;
    legalSensitivity: number;
    industryRegulation: number;
    brandConfidentialityRisk: number;
    culturalNuance: number;
    aiConfidenceGap: number;
    flags: string[];
    explanation: string;
  };
  complianceChecks: Array<{
    id: string;
    status: CheckStatus;
    conflicts: unknown[];
    prohibited: unknown[];
    summary: string;
    createdAt: string;
  }>;
  auditEvents: Array<{
    id: string;
    actor: string;
    action: string;
    status: string;
    metadata: unknown | null;
    createdAt: string;
  }>;
  certificate: null | {
    id: string;
    certificateCode: string;
    status: CertificateStatus;
    issuedAt: string | null;
    issuedBy: string | null;
    certificate: unknown;
  };
};

export function toRequestView(request: any): RequestView {
  return {
    id: request.id,
    requestCode: request.requestCode,
    title: request.title,
    organizationName: request.organization.name,
    organizationId: request.organizationId,
    terminology: request.organization.terminology?.map((term: any) => ({
      id: term.id,
      sourceTerm: term.sourceTerm,
      approvedTerm: term.approvedTerm,
      targetLanguage: term.targetLanguage,
      notes: term.notes,
    })) ?? [],
    documentType: request.documentType,
    industry: request.industry,
    sourceLanguage: request.sourceLanguage,
    targetLanguage: request.targetLanguage,
    deadline: request.deadline?.toISOString() ?? null,
    confidentialityLevel: request.confidentialityLevel,
    riskExpectation: request.riskExpectation,
    requiredReviewLevel: request.requiredReviewLevel,
    specialInstructions: request.specialInstructions,
    status: request.status,
    currentStage: request.currentStage,
    riskLevel: request.riskLevel,
    riskScore: request.riskScore,
    aiConfidence: request.aiConfidence,
    certificateStatus: request.certificateStatus,
    legalReviewAt: request.legalReviewAt?.toISOString() ?? null,
    finalApprovedAt: request.finalApprovedAt?.toISOString() ?? null,
    finalApprovedBy: request.finalApprovedBy,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    assets: request.uploadedAssets.map((asset: any) => ({
      id: asset.id,
      fileName: asset.fileName,
      fileType: asset.fileType,
      fileSize: asset.fileSize,
      uploadedAt: asset.uploadedAt.toISOString(),
    })),
    versions: request.versions.map((version: any) => ({
      id: version.id,
      type: version.type,
      content: version.content,
      language: version.language,
      createdBy: version.createdBy,
      notes: version.notes,
      createdAt: version.createdAt.toISOString(),
    })),
    assignments: request.assignments.map((assignment: any) => ({
      id: assignment.id,
      reviewerName: assignment.reviewerName,
      reviewerRole: assignment.reviewerRole,
      status: assignment.status,
    })),
    riskAssessment: request.riskAssessment
      ? {
          totalScore: request.riskAssessment.totalScore,
          riskLevel: request.riskAssessment.riskLevel,
          legalSensitivity: request.riskAssessment.legalSensitivity,
          industryRegulation: request.riskAssessment.industryRegulation,
          brandConfidentialityRisk:
            request.riskAssessment.brandConfidentialityRisk,
          culturalNuance: request.riskAssessment.culturalNuance,
          aiConfidenceGap: request.riskAssessment.aiConfidenceGap,
          flags: parseJson(request.riskAssessment.flagsJson, []),
          explanation: request.riskAssessment.explanation,
        }
      : null,
    complianceChecks: request.complianceChecks.map((check: any) => ({
      id: check.id,
      status: check.status,
      conflicts: parseJson(check.conflictsJson, []),
      prohibited: parseJson(check.prohibitedJson, []),
      summary: check.summary,
      createdAt: check.createdAt.toISOString(),
    })),
    auditEvents: request.auditEvents.map((event: any) => ({
      id: event.id,
      actor: event.actor,
      action: event.action,
      status: event.status,
      metadata: parseJson(event.metadataJson, null),
      createdAt: event.createdAt.toISOString(),
    })),
    certificate: request.certificate
      ? {
          id: request.certificate.id,
          certificateCode: request.certificate.certificateCode,
          status: request.certificate.status,
          issuedAt: request.certificate.issuedAt?.toISOString() ?? null,
          issuedBy: request.certificate.issuedBy,
          certificate: parseJson(request.certificate.certificateJson, {}),
        }
      : null,
  };
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
