import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import {
  CertificateStatus,
  DocumentRisk,
  RequestStatus,
  ReviewStatus,
  UserRole,
  VersionType,
  WorkflowStage,
} from "./enums";

const sourceText =
  "The client must understand all fees before signing the agreement.";

const aiDraft =
  "Le client doit comprendre tous les frais avant de signer l’accord.";

const humanFinal =
  "Le client doit prendre connaissance de l’ensemble des frais applicables avant de signer la convention.";

/**
 * Populate a fresh Nortam Assure workspace with demo organizations, accounts,
 * terminology, and translation requests across every workflow stage.
 *
 * This is intentionally idempotent-by-reset: it clears existing rows first, so
 * it is safe to re-run. The runtime bootstrap (lib/bootstrap.ts) only calls it
 * when the database has no users, while `prisma db seed` runs it on demand.
 */
export async function seedDemoWorkspace(prisma: PrismaClient) {
  await prisma.message.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.reviewAssignment.deleteMany();
  await prisma.complianceCheck.deleteMany();
  await prisma.terminologyTerm.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.translationVersion.deleteMany();
  await prisma.documentAsset.deleteMany();
  await prisma.translationRequest.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const [mapleBank, northStar, veridian, aurora, softLayer] = await Promise.all([
    prisma.organization.create({
      data: { name: "MapleBank Legal", type: "CLIENT" },
    }),
    prisma.organization.create({
      data: { name: "NorthStar Retail", type: "CLIENT" },
    }),
    prisma.organization.create({
      data: { name: "Veridian Health", type: "CLIENT" },
    }),
    prisma.organization.create({
      data: { name: "Aurora Studios", type: "CLIENT" },
    }),
    prisma.organization.create({
      data: { name: "SoftLayer Cloud", type: "CLIENT" },
    }),
  ]);

  const clientPassword = await bcrypt.hash("DemoClient123!", 12);
  const employeePassword = await bcrypt.hash("DemoEmployee123!", 12);
  const adminPassword = await bcrypt.hash("DemoAdmin123!", 12);

  const client = await prisma.user.create({
    data: {
      email: "client@nortamdemo.com",
      passwordHash: clientPassword,
      name: "Isabelle Tremblay",
      role: UserRole.CLIENT,
      organizationId: mapleBank.id,
      memberships: {
        create: {
          organizationId: mapleBank.id,
          roleLabel: "Senior Counsel",
        },
      },
    },
  });

  const employee = await prisma.user.create({
    data: {
      email: "employee@nortamdemo.com",
      passwordHash: employeePassword,
      name: "Priya Shah",
      role: UserRole.EMPLOYEE,
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@nortamdemo.com",
      passwordHash: adminPassword,
      name: "Nadia Laurent",
      role: UserRole.ADMIN,
    },
  });

  await prisma.terminologyTerm.createMany({
    data: [
      {
        organizationId: mapleBank.id,
        sourceTerm: "Agreement",
        approvedTerm: "Convention",
        targetLanguage: "French Canadian",
        notes: "Use for regulated consumer credit documents.",
      },
      {
        organizationId: mapleBank.id,
        sourceTerm: "Fees",
        approvedTerm: "Frais applicables",
        targetLanguage: "French Canadian",
        notes: "Required in fee disclosures.",
      },
      {
        organizationId: mapleBank.id,
        sourceTerm: "Disclosure",
        approvedTerm: "Document d’information",
        targetLanguage: "French Canadian",
      },
      {
        organizationId: mapleBank.id,
        sourceTerm: "Consumer",
        approvedTerm: "Consommateur",
        targetLanguage: "French Canadian",
      },
      {
        organizationId: mapleBank.id,
        sourceTerm: "Must",
        approvedTerm: "Doit",
        targetLanguage: "French Canadian",
      },
    ],
  });

  const consumerRequest = await prisma.translationRequest.create({
    data: {
      requestCode: "NA-2026-0418",
      title: "Consumer Credit Disclosure – French Canada",
      organizationId: mapleBank.id,
      documentType: "Regulated financial disclosure",
      industry: "Banking / Financial Services",
      sourceLanguage: "English",
      targetLanguage: "French Canadian",
      deadline: new Date("2026-05-25T21:00:00-04:00"),
      confidentialityLevel: "High",
      riskExpectation: "High",
      requiredReviewLevel: "Legal translator + compliance editor",
      specialInstructions:
        "Use approved Quebec French legal terminology. Maintain formal tone. Flag any clauses where literal translation may create compliance risk.",
      status: RequestStatus.HUMAN_REVIEW,
      currentStage: WorkflowStage.HUMAN_REVIEW,
      riskLevel: DocumentRisk.HIGH,
      riskScore: 87,
      aiConfidence: 91,
      certificateStatus: CertificateStatus.PENDING,
      createdById: client.id,
      uploadedAssets: {
        create: {
          fileName: "consumer-credit-disclosure-en.txt",
          filePath: "storage/uploads/seed-consumer-credit-disclosure-en.txt",
          fileType: "text/plain",
          fileSize: sourceText.length,
          extractedText: sourceText,
        },
      },
      versions: {
        create: [
          {
            type: VersionType.SOURCE_EXTRACT,
            content: sourceText,
            language: "English",
            createdBy: "MapleBank Legal",
          },
          {
            type: VersionType.AI_DRAFT,
            content: aiDraft,
            language: "French Canadian",
            createdBy: "Nortam Assure AI",
            notes:
              "Generated by deterministic local fallback for demo continuity.",
          },
        ],
      },
      riskAssessment: {
        create: {
          totalScore: 87,
          riskLevel: DocumentRisk.HIGH,
          legalSensitivity: 32,
          industryRegulation: 24,
          brandConfidentialityRisk: 18,
          culturalNuance: 8,
          aiConfidenceGap: 5,
          flagsJson: JSON.stringify([
            "Regulated financial disclosure",
            "Quebec French terminology required",
            "Legal wording sensitivity",
            "Client-approved term conflicts detected",
            "Potential reputational risk if wording is inaccurate",
          ]),
          explanation:
            "High Risk – 87/100. French Canadian regulated banking disclosure requires legal terminology control and human compliance review.",
        },
      },
      assignments: {
        create: [
          {
            reviewerName: "Amira Chen",
            reviewerRole: "Legal Translator",
            status: ReviewStatus.IN_PROGRESS,
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
      auditEvents: {
        create: [
          {
            actor: "Client",
            action: "MapleBank Legal uploaded document",
            status: "complete",
            createdAt: new Date("2026-05-25T09:14:00-04:00"),
          },
          {
            actor: "Nortam Assure AI",
            action: "AI first draft generated",
            status: "complete",
            createdAt: new Date("2026-05-25T09:16:00-04:00"),
          },
          {
            actor: "Risk Intelligence",
            action: "Risk score assigned: High",
            status: "complete",
            createdAt: new Date("2026-05-25T09:17:00-04:00"),
          },
          {
            actor: "Amira Chen, Legal Translator",
            action: "Legal reviewer edited clause 4.2",
            status: "complete",
            createdAt: new Date("2026-05-25T09:21:00-04:00"),
          },
          {
            actor: "Terminology Engine",
            action: "Terminology conflict resolved",
            status: "complete",
            createdAt: new Date("2026-05-25T09:28:00-04:00"),
          },
          {
            actor: "David Morgan, Compliance Editor",
            action: "Compliance editor approved wording",
            status: "complete",
            createdAt: new Date("2026-05-25T09:35:00-04:00"),
          },
          {
            actor: "Priya Shah, Final Approver",
            action: "Final approver ready",
            status: "complete",
            createdAt: new Date("2026-05-25T09:41:00-04:00"),
          },
        ],
      },
    },
  });

  await prisma.translationVersion.create({
    data: {
      requestId: consumerRequest.id,
      type: VersionType.HUMAN_FINAL,
      content: humanFinal,
      language: "French Canadian",
      createdBy: "Amira Chen",
      notes:
        "Adjusted for formal Quebec French legal phrasing and client-approved disclosure terminology.",
    },
  });

  await seedRequest(prisma, {
    requestCode: "NA-2026-0142",
    title: "Terms of Use Update – Quebec",
    organizationId: softLayer.id,
    createdById: client.id,
    documentType: "Regulated terms of use",
    industry: "Cloud / SaaS",
    targetLanguage: "French Canadian",
    riskLevel: DocumentRisk.HIGH,
    riskScore: 78,
    status: RequestStatus.CLIENT_APPROVAL,
    stage: WorkflowStage.TRUST_CERTIFICATE,
    certificateStatus: CertificateStatus.READY,
  });

  const completed = await seedRequest(prisma, {
    requestCode: "NA-2026-0139",
    title: "Internal HR Memo – Spanish",
    organizationId: northStar.id,
    createdById: client.id,
    documentType: "Internal HR communication",
    industry: "Retail",
    targetLanguage: "Spanish",
    riskLevel: DocumentRisk.LOW,
    riskScore: 22,
    status: RequestStatus.COMPLETED,
    stage: WorkflowStage.TRUST_CERTIFICATE,
    certificateStatus: CertificateStatus.ISSUED,
    finalApprovedBy: "Priya Shah",
  });

  await prisma.certificate.create({
    data: {
      requestId: completed.id,
      certificateCode: "NA-CERT-2026-0139",
      status: CertificateStatus.ISSUED,
      issuedAt: new Date("2026-05-23T15:05:00-04:00"),
      issuedBy: "Priya Shah",
      auditTrailId: completed.id,
      certificateJson: JSON.stringify({
        documentName: completed.title,
        clientName: "NorthStar Retail",
        sourceLanguage: "English",
        targetLanguage: "Spanish",
        riskLevel: "LOW",
        aiDraftCompleted: true,
        humanReviewCompleted: true,
        terminologyCheckCompleted: true,
        complianceReviewCompleted: true,
        auditTrailCaptured: true,
        finalApprover: "Priya Shah",
        certificateId: "NA-CERT-2026-0139",
        proofLine: "The certificate is not decoration. It is proof of process.",
      }),
    },
  });

  await seedRequest(prisma, {
    requestCode: "NA-2026-0411",
    title: "Medical Device Warning Label – German",
    organizationId: veridian.id,
    createdById: client.id,
    documentType: "Regulated medical device label",
    industry: "Healthcare / MedTech",
    targetLanguage: "German",
    riskLevel: DocumentRisk.HIGH,
    riskScore: 91,
    status: RequestStatus.COMPLIANCE_CHECK,
    stage: WorkflowStage.COMPLIANCE_APPROVAL,
    certificateStatus: CertificateStatus.PENDING,
  });

  await seedRequest(prisma, {
    requestCode: "NA-2026-0406",
    title: "Streaming Trailer Subtitles – Japanese",
    organizationId: aurora.id,
    createdById: client.id,
    documentType: "Entertainment / subtitle file",
    industry: "Media & Entertainment",
    targetLanguage: "Japanese",
    riskLevel: DocumentRisk.MEDIUM,
    riskScore: 54,
    status: RequestStatus.HUMAN_REVIEW,
    stage: WorkflowStage.HUMAN_REVIEW,
    certificateStatus: CertificateStatus.PENDING,
  });

  await seedRequest(prisma, {
    requestCode: "NA-2026-0395",
    title: "Product Fee Notice – French Canada",
    organizationId: mapleBank.id,
    createdById: client.id,
    documentType: "Customer-facing fee notice",
    industry: "Banking / Financial Services",
    targetLanguage: "French Canadian",
    riskLevel: DocumentRisk.MEDIUM,
    riskScore: 61,
    status: RequestStatus.COMPLIANCE_CHECK,
    stage: WorkflowStage.COMPLIANCE_APPROVAL,
    certificateStatus: CertificateStatus.PENDING,
  });

  // A fresh request that has only just been submitted — this is the default
  // demo starting point so an employee can run the ENTIRE workflow from the
  // first button (Generate AI Draft) through to the Trust Certificate.
  await prisma.translationRequest.create({
    data: {
      requestCode: "NA-2026-0461",
      title: "Mortgage Disclosure Addendum – French Canada",
      organizationId: mapleBank.id,
      documentType: "Regulated financial disclosure",
      industry: "Banking / Financial Services",
      sourceLanguage: "English",
      targetLanguage: "French Canadian",
      deadline: new Date("2026-06-08T21:00:00-04:00"),
      confidentialityLevel: "High",
      riskExpectation: "High",
      requiredReviewLevel: "Legal translator + compliance editor",
      specialInstructions:
        "Use approved Quebec French legal terminology. Maintain formal tone. Flag clauses where a literal translation could create compliance risk.",
      status: RequestStatus.SUBMITTED,
      currentStage: WorkflowStage.SUBMITTED,
      certificateStatus: CertificateStatus.LOCKED,
      createdById: client.id,
      versions: {
        create: {
          type: VersionType.SOURCE_EXTRACT,
          content:
            "The client must understand all fees before signing the agreement.",
          language: "English",
          createdBy: "MapleBank Legal",
        },
      },
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
      auditEvents: {
        create: {
          actor: "MapleBank Legal",
          action: "Client created request",
          status: "complete",
        },
      },
    },
  });

  await prisma.auditEvent.create({
    data: {
      requestId: null,
      userId: employee.id,
      actor: "Priya Shah",
      action: "Seeded Nortam Assure demo workspace",
      status: "complete",
      metadataJson: JSON.stringify({ seed: true }),
    },
  });
}

async function seedRequest(
  prisma: PrismaClient,
  input: {
    requestCode: string;
    title: string;
    organizationId: string;
    createdById: string;
    documentType: string;
    industry: string;
    targetLanguage: string;
    riskLevel: DocumentRisk;
    riskScore: number;
    status: RequestStatus;
    stage: WorkflowStage;
    certificateStatus: CertificateStatus;
    finalApprovedBy?: string;
  }
) {
  return prisma.translationRequest.create({
    data: {
      requestCode: input.requestCode,
      title: input.title,
      organizationId: input.organizationId,
      documentType: input.documentType,
      industry: input.industry,
      sourceLanguage: "English",
      targetLanguage: input.targetLanguage,
      confidentialityLevel:
        input.riskLevel === DocumentRisk.LOW ? "Standard" : "High",
      riskExpectation: input.riskLevel,
      requiredReviewLevel:
        input.riskLevel === DocumentRisk.LOW
          ? "AI-assisted with human spot-check"
          : "Subject-matter translator + compliance editor",
      specialInstructions:
        "Maintain client-approved terminology and flag regulated wording.",
      status: input.status,
      currentStage: input.stage,
      riskLevel: input.riskLevel,
      riskScore: input.riskScore,
      aiConfidence: input.riskLevel === DocumentRisk.LOW ? 98 : 92,
      certificateStatus: input.certificateStatus,
      finalApprovedAt:
        input.certificateStatus === CertificateStatus.READY ||
        input.certificateStatus === CertificateStatus.ISSUED
          ? new Date("2026-05-23T14:50:00-04:00")
          : null,
      finalApprovedBy: input.finalApprovedBy,
      createdById: input.createdById,
      versions: {
        create: [
          {
            type: VersionType.SOURCE_EXTRACT,
            content: `Seed source text for ${input.title}.`,
            language: "English",
            createdBy: "Client",
          },
          {
            type: VersionType.AI_DRAFT,
            content: `AI-assisted draft for ${input.title}.`,
            language: input.targetLanguage,
            createdBy: "Nortam Assure AI",
          },
          {
            type: VersionType.HUMAN_FINAL,
            content: `Human-verified final translation for ${input.title}.`,
            language: input.targetLanguage,
            createdBy: "Nortam Review Operations",
          },
        ],
      },
      assignments: {
        create: [
          {
            reviewerName: "Amira Chen",
            reviewerRole: "Legal Translator",
            status: ReviewStatus.COMPLETE,
          },
          {
            reviewerName: "David Morgan",
            reviewerRole: "Compliance Editor",
            status:
              input.status === RequestStatus.COMPLIANCE_CHECK
                ? ReviewStatus.IN_PROGRESS
                : ReviewStatus.COMPLETE,
          },
        ],
      },
      auditEvents: {
        create: [
          {
            actor: "Client",
            action: `${input.title} created`,
            status: "complete",
          },
          {
            actor: "Nortam Assure AI",
            action: "AI first draft generated",
            status: "complete",
          },
          {
            actor: "Risk Intelligence",
            action: `Risk score assigned: ${input.riskLevel}`,
            status: "complete",
          },
        ],
      },
    },
  });
}
