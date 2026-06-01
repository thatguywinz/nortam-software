import {
  type TranslationRequest,
} from "@prisma/client";
import { CertificateStatus, DocumentRisk } from "@/lib/enums";

export function certificateCodeFor(requestCode: string) {
  const year = new Date().getFullYear();
  const suffix = requestCode.split("-").pop() ?? Math.floor(Math.random() * 9000 + 1000).toString();
  return `NA-CERT-${year}-${suffix}`;
}

export function buildCertificatePayload(input: {
  request: TranslationRequest & {
    organization: { name: string };
  };
  finalApprover: string;
  certificateCode: string;
  auditTrailId: string;
}) {
  return {
    documentName: input.request.title,
    clientName: input.request.organization.name,
    sourceLanguage: input.request.sourceLanguage,
    targetLanguage: input.request.targetLanguage,
    riskLevel: input.request.riskLevel ?? DocumentRisk.MEDIUM,
    riskScore: input.request.riskScore,
    aiDraftCompleted: true,
    humanReviewCompleted: true,
    terminologyCheckCompleted: true,
    complianceReviewCompleted: true,
    auditTrailCaptured: true,
    finalApprover: input.finalApprover,
    certificateId: input.certificateCode,
    auditTrailId: input.auditTrailId,
    timestamp: new Date().toISOString(),
    status: CertificateStatus.ISSUED,
    proofLine: "The certificate is not decoration. It is proof of process.",
  };
}
