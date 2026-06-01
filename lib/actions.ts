"use server";

import { revalidatePath } from "next/cache";
import {
  CertificateStatus,
  CheckStatus,
  RequestStatus,
  ReviewStatus,
  UserRole,
  VersionType,
  WorkflowStage,
} from "@/lib/enums";
import { addAuditEvent } from "@/lib/audit";
import { generateAiDraft } from "@/lib/aiDraft";
import {
  buildCertificatePayload,
  certificateCodeFor,
} from "@/lib/certificate";
import { getSessionUser, requireEmployee } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/riskScoring";
import { runTerminologyCheck } from "@/lib/terminology";
import { storeUpload } from "@/lib/upload";
import {
  createRequestSchema,
  humanReviewSchema,
  parseDeadline,
} from "@/lib/validators";
import {
  canApproveFinal,
  canGenerateAiDraft,
  canGenerateCertificate,
  canRunCompliance,
  canRunRisk,
  canSaveHumanFinal,
} from "@/lib/workflow";

type ActionResult =
  | { ok: true; requestId?: string; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function actionError(error: unknown): ActionResult {
  if (error instanceof Error) {
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "Something went wrong." };
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function generateRequestCode() {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const code = `NA-${year}-${suffix}`;
    const existing = await prisma.translationRequest.findUnique({
      where: { requestCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique request code.");
}

async function mapleBankOrganizationId() {
  const organization = await prisma.organization.findFirst({
    where: { name: "MapleBank Legal" },
    select: { id: true },
  });
  if (!organization) throw new Error("No demo client organization exists.");
  return organization.id;
}

export async function createTranslationRequestAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("You must be signed in.");
    if (user.role !== UserRole.CLIENT && user.role !== UserRole.ADMIN) {
      throw new Error("Only client users can create requests.");
    }

    const parsed = createRequestSchema.safeParse({
      title: formString(formData, "title"),
      documentType: formString(formData, "documentType"),
      industry: formString(formData, "industry"),
      sourceLanguage: formString(formData, "sourceLanguage"),
      targetLanguage: formString(formData, "targetLanguage"),
      deadline: formString(formData, "deadline"),
      confidentialityLevel: formString(formData, "confidentialityLevel"),
      riskExpectation: formString(formData, "riskExpectation"),
      requiredReviewLevel: formString(formData, "requiredReviewLevel"),
      specialInstructions: formString(formData, "specialInstructions"),
      glossary: formString(formData, "glossary"),
      sourceText: formString(formData, "sourceText"),
    });

    if (!parsed.success) {
      return {
        ok: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const fileValue = formData.get("file");
    const file =
      fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

    if (!file && !parsed.data.sourceText) {
      return {
        ok: false,
        error: "Upload a document or paste source text before submitting.",
      };
    }

    const storedUpload = file ? await storeUpload(file) : null;
    const sourceContent =
      parsed.data.sourceText || storedUpload?.extractedText || null;
    const organizationId =
      user.organizationId ?? (await mapleBankOrganizationId());
    const requestCode = await generateRequestCode();

    const request = await prisma.translationRequest.create({
      data: {
        requestCode,
        title: parsed.data.title,
        organizationId,
        documentType: parsed.data.documentType,
        industry: parsed.data.industry,
        sourceLanguage: parsed.data.sourceLanguage,
        targetLanguage: parsed.data.targetLanguage,
        deadline: parseDeadline(parsed.data.deadline),
        confidentialityLevel: parsed.data.confidentialityLevel,
        riskExpectation: parsed.data.riskExpectation,
        requiredReviewLevel: parsed.data.requiredReviewLevel,
        specialInstructions: parsed.data.specialInstructions,
        status: RequestStatus.SUBMITTED,
        currentStage: WorkflowStage.SUBMITTED,
        certificateStatus: CertificateStatus.LOCKED,
        createdById: user.id,
        uploadedAssets: storedUpload
          ? {
              create: {
                fileName: storedUpload.fileName,
                filePath: storedUpload.filePath,
                fileType: storedUpload.fileType,
                fileSize: storedUpload.fileSize,
                extractedText: storedUpload.extractedText,
              },
            }
          : undefined,
        versions: sourceContent
          ? {
              create: {
                type: VersionType.SOURCE_EXTRACT,
                content: sourceContent,
                language: parsed.data.sourceLanguage,
                createdBy: user.name ?? "Client",
                notes: storedUpload
                  ? "Source text captured from upload or client paste."
                  : "Source text pasted by client.",
              },
            }
          : undefined,
        assignments: {
          create: [
            {
              reviewerName: "Amira Chen",
              reviewerRole: "Legal Translator",
              status: ReviewStatus.NOT_STARTED,
            },
            {
              reviewerName: "David Morgan",
              reviewerRole: "Compliance Editor",
              status: ReviewStatus.NOT_STARTED,
            },
            {
              reviewerName: "Priya Shah",
              reviewerRole: "Final Approver",
              status: ReviewStatus.NOT_STARTED,
            },
          ],
        },
      },
      select: { id: true, requestCode: true },
    });

    await addAuditEvent({
      requestId: request.id,
      userId: user.id,
      actor: user.name ?? "Client",
      action: "Client created request",
      metadata: { requestCode: request.requestCode },
    });

    if (storedUpload) {
      await addAuditEvent({
        requestId: request.id,
        userId: user.id,
        actor: user.name ?? "Client",
        action: "Client uploaded document",
        metadata: {
          fileName: storedUpload.fileName,
          fileType: storedUpload.fileType,
          fileSize: storedUpload.fileSize,
        },
      });
    }

    revalidatePath("/client");
    revalidatePath("/employee");
    return { ok: true, requestId: request.id };
  } catch (error) {
    return actionError(error);
  }
}

export async function generateAiDraftAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: {
        uploadedAssets: true,
        versions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!request) throw new Error("Request not found.");
    if (!canGenerateAiDraft(request.status as RequestStatus)) {
      throw new Error("AI draft generation is only available after submission.");
    }

    const sourceText =
      request.versions.find((version) => version.type === VersionType.SOURCE_EXTRACT)
        ?.content ??
      request.uploadedAssets.find((asset) => asset.extractedText)?.extractedText ??
      request.title;

    const draft = await generateAiDraft({
      title: request.title,
      sourceText,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      industry: request.industry,
      documentType: request.documentType,
      specialInstructions: request.specialInstructions,
    });

    await prisma.translationVersion.create({
      data: {
        requestId,
        type: VersionType.AI_DRAFT,
        content: draft.content,
        language: request.targetLanguage,
        createdBy: draft.provider,
        notes: "Generated server-side and stored as a persistent version.",
      },
    });

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.AI_DRAFT_READY,
        currentStage: WorkflowStage.AI_DRAFT,
        aiConfidence: draft.confidence,
      },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: "Nortam Assure AI",
      action: "AI first draft generated",
      metadata: { provider: draft.provider, confidence: draft.confidence },
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "AI first draft generated." };
  } catch (error) {
    return actionError(error);
  }
}

export async function runRiskScoringAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: { versions: true },
    });

    if (!request) throw new Error("Request not found.");
    if (!canRunRisk(request.status as RequestStatus)) {
      throw new Error("Risk scoring is available after an AI draft exists.");
    }
    if (!request.versions.some((version) => version.type === VersionType.AI_DRAFT)) {
      throw new Error("Generate an AI draft before risk scoring.");
    }

    const risk = calculateRiskScore(request);

    await prisma.riskAssessment.upsert({
      where: { requestId },
      update: {
        totalScore: risk.totalScore,
        riskLevel: risk.riskLevel,
        legalSensitivity: risk.legalSensitivity,
        industryRegulation: risk.industryRegulation,
        brandConfidentialityRisk: risk.brandConfidentialityRisk,
        culturalNuance: risk.culturalNuance,
        aiConfidenceGap: risk.aiConfidenceGap,
        flagsJson: JSON.stringify(risk.flags),
        explanation: risk.explanation,
      },
      create: {
        requestId,
        totalScore: risk.totalScore,
        riskLevel: risk.riskLevel,
        legalSensitivity: risk.legalSensitivity,
        industryRegulation: risk.industryRegulation,
        brandConfidentialityRisk: risk.brandConfidentialityRisk,
        culturalNuance: risk.culturalNuance,
        aiConfidenceGap: risk.aiConfidenceGap,
        flagsJson: JSON.stringify(risk.flags),
        explanation: risk.explanation,
      },
    });

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.RISK_SCORED,
        currentStage: WorkflowStage.RISK_INTELLIGENCE,
        riskLevel: risk.riskLevel,
        riskScore: risk.totalScore,
      },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: "Risk Intelligence",
      action: `Risk score assigned: ${risk.riskLevel[0]}${risk.riskLevel
        .slice(1)
        .toLowerCase()}`,
      metadata: { score: risk.totalScore, flags: risk.flags },
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Risk score assigned." };
  } catch (error) {
    return actionError(error);
  }
}

export async function assignReviewerAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: { assignments: true },
    });
    if (!request) throw new Error("Request not found.");

    if (request.assignments.length === 0) {
      await prisma.reviewAssignment.createMany({
        data: [
          {
            requestId,
            reviewerName: "Amira Chen",
            reviewerRole: "Legal Translator",
            status: ReviewStatus.NOT_STARTED,
          },
          {
            requestId,
            reviewerName: "David Morgan",
            reviewerRole: "Compliance Editor",
            status: ReviewStatus.NOT_STARTED,
          },
          {
            requestId,
            reviewerName: "Priya Shah",
            reviewerRole: "Final Approver",
            status: ReviewStatus.NOT_STARTED,
          },
        ],
      });
    }

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: user.name ?? "Nortam operations",
      action: "Review team assigned",
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Review team assigned." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveHumanFinalAction(
  requestId: string,
  finalContent: string,
  notes?: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const parsed = humanReviewSchema.safeParse({ finalContent, notes });
    if (!parsed.success) {
      return {
        ok: false,
        error: "Final translation cannot be empty.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: { versions: true },
    });

    if (!request) throw new Error("Request not found.");
    if (!canSaveHumanFinal(request.status as RequestStatus)) {
      throw new Error("Human review opens after risk scoring.");
    }
    if (!request.versions.some((version) => version.type === VersionType.AI_DRAFT)) {
      throw new Error("Generate an AI draft before saving a human final.");
    }

    await prisma.translationVersion.create({
      data: {
        requestId,
        type: VersionType.HUMAN_FINAL,
        content: parsed.data.finalContent,
        language: request.targetLanguage,
        createdBy: user.name ?? "Nortam reviewer",
        notes: parsed.data.notes,
      },
    });

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.HUMAN_REVIEW,
        currentStage: WorkflowStage.HUMAN_REVIEW,
      },
    });

    await prisma.reviewAssignment.updateMany({
      where: { requestId, reviewerRole: { contains: "Legal" } },
      data: { status: ReviewStatus.IN_PROGRESS },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: user.name ?? "Nortam reviewer",
      action: "Human final version saved",
      metadata: { notes: parsed.data.notes },
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Human final saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function runComplianceCheckAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: {
        organization: { include: { terminology: true } },
        versions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!request) throw new Error("Request not found.");
    if (!canRunCompliance(request.status as RequestStatus)) {
      throw new Error("Compliance checks require a saved human final.");
    }

    const aiDraft = request.versions.find(
      (version) => version.type === VersionType.AI_DRAFT
    )?.content;
    const humanFinal = request.versions.find(
      (version) => version.type === VersionType.HUMAN_FINAL
    )?.content;

    if (!humanFinal) {
      throw new Error("Save a human final before running compliance.");
    }

    const result = runTerminologyCheck({
      terms: request.organization.terminology,
      aiDraft,
      humanFinal,
      targetLanguage: request.targetLanguage,
    });

    await prisma.complianceCheck.create({
      data: {
        requestId,
        status: result.status,
        conflictsJson: JSON.stringify(result.conflicts),
        prohibitedJson: JSON.stringify(result.prohibited),
        summary: result.summary,
      },
    });

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.COMPLIANCE_CHECK,
        currentStage: WorkflowStage.COMPLIANCE_APPROVAL,
      },
    });

    await prisma.reviewAssignment.updateMany({
      where: { requestId, reviewerRole: { contains: "Compliance" } },
      data: {
        status:
          result.status === CheckStatus.PASSED
            ? ReviewStatus.COMPLETE
            : ReviewStatus.IN_PROGRESS,
      },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: "Terminology Engine",
      action:
        result.status === CheckStatus.PASSED
          ? "Terminology conflict resolved"
          : "Terminology/compliance check flagged issues",
      metadata: {
        conflicts: result.conflicts,
        prohibited: result.prohibited,
      },
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Terminology and compliance check run." };
  } catch (error) {
    return actionError(error);
  }
}

export async function markLegalReviewCompleteAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const final = await prisma.translationVersion.findFirst({
      where: { requestId, type: VersionType.HUMAN_FINAL },
      orderBy: { createdAt: "desc" },
    });
    if (!final) throw new Error("Save a human final before closing legal review.");

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        legalReviewAt: new Date(),
        legalReviewBy: user.name ?? "Nortam reviewer",
      },
    });

    await prisma.reviewAssignment.updateMany({
      where: { requestId, reviewerRole: { contains: "Legal" } },
      data: { status: ReviewStatus.COMPLETE },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: user.name ?? "Nortam reviewer",
      action: "Legal review marked complete",
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Legal review marked complete." };
  } catch (error) {
    return actionError(error);
  }
}

export async function approveFinalReviewAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: {
        complianceChecks: { orderBy: { createdAt: "desc" }, take: 1 },
        versions: true,
      },
    });

    if (!request) throw new Error("Request not found.");
    if (!canApproveFinal(request.status as RequestStatus)) {
      throw new Error("Final approval is available after compliance review.");
    }
    if (!request.legalReviewAt) {
      throw new Error("Mark legal review complete before final approval.");
    }
    if (!request.versions.some((version) => version.type === VersionType.HUMAN_FINAL)) {
      throw new Error("Final approval requires a human final version.");
    }

    const latestCheck = request.complianceChecks[0];
    if (!latestCheck || latestCheck.status !== CheckStatus.PASSED) {
      throw new Error("Compliance must pass before final approval.");
    }

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.CLIENT_APPROVAL,
        currentStage: WorkflowStage.TRUST_CERTIFICATE,
        certificateStatus: CertificateStatus.READY,
        finalApprovedAt: new Date(),
        finalApprovedBy: user.name ?? "Nortam approver",
      },
    });

    await prisma.reviewAssignment.updateMany({
      where: { requestId, reviewerRole: { contains: "Final" } },
      data: { status: ReviewStatus.COMPLETE },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: user.name ?? "Nortam approver",
      action: "Final review approved",
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Final review approved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function generateCertificateAction(
  requestId: string
): Promise<ActionResult> {
  try {
    const user = await requireEmployee();
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      include: {
        organization: true,
        certificate: true,
        versions: true,
        auditEvents: true,
        complianceChecks: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!request) throw new Error("Request not found.");
    if (request.certificate?.status === CertificateStatus.ISSUED) {
      return { ok: true, message: "Certificate already issued." };
    }
    if (
      !canGenerateCertificate({
        status: request.status as RequestStatus,
        certificateStatus: request.certificateStatus as CertificateStatus,
      })
    ) {
      throw new Error("Certificate generation requires final approval.");
    }
    if (!request.finalApprovedAt) {
      throw new Error("Final approval must be recorded before certificate issue.");
    }
    if (!request.versions.some((version) => version.type === VersionType.HUMAN_FINAL)) {
      throw new Error("Certificate requires a human final version.");
    }
    if (request.auditEvents.length === 0) {
      throw new Error("Certificate requires an audit trail.");
    }

    const certificateCode = certificateCodeFor(request.requestCode);
    const payload = buildCertificatePayload({
      request,
      finalApprover: request.finalApprovedBy ?? user.name ?? "Nortam approver",
      certificateCode,
      auditTrailId: request.id,
    });

    await prisma.certificate.upsert({
      where: { requestId },
      update: {
        certificateCode,
        status: CertificateStatus.ISSUED,
        issuedAt: new Date(),
        issuedBy: user.name ?? "Nortam approver",
        auditTrailId: request.id,
        certificateJson: JSON.stringify(payload),
      },
      create: {
        requestId,
        certificateCode,
        status: CertificateStatus.ISSUED,
        issuedAt: new Date(),
        issuedBy: user.name ?? "Nortam approver",
        auditTrailId: request.id,
        certificateJson: JSON.stringify(payload),
      },
    });

    await prisma.translationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.COMPLETED,
        currentStage: WorkflowStage.TRUST_CERTIFICATE,
        certificateStatus: CertificateStatus.ISSUED,
      },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: "Certificate Engine",
      action: "Nortam Trust Certificate issued",
      metadata: { certificateCode },
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Nortam Trust Certificate issued." };
  } catch (error) {
    return actionError(error);
  }
}

export async function sendMessageAction(
  requestId: string,
  body: string
): Promise<ActionResult> {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("You must be signed in.");
    if (!body.trim()) throw new Error("Message cannot be empty.");

    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      select: { organizationId: true },
    });
    if (!request) throw new Error("Request not found.");
    if (
      user.role === UserRole.CLIENT &&
      request.organizationId !== user.organizationId
    ) {
      throw new Error("You cannot message on another client's request.");
    }

    await prisma.message.create({
      data: {
        requestId,
        userId: user.id,
        body: body.trim(),
      },
    });

    await addAuditEvent({
      requestId,
      userId: user.id,
      actor: user.name ?? "Nortam user",
      action: "Message sent",
    });

    revalidateWorkflow(requestId);
    return { ok: true, message: "Message sent." };
  } catch (error) {
    return actionError(error);
  }
}

function revalidateWorkflow(requestId: string) {
  revalidatePath("/client");
  revalidatePath(`/client/requests/${requestId}`);
  revalidatePath("/employee");
  revalidatePath(`/employee/requests/${requestId}`);
}
