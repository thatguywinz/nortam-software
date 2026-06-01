export const requestInclude = {
  organization: { include: { terminology: true } },
  uploadedAssets: { orderBy: { uploadedAt: "desc" } },
  versions: { orderBy: { createdAt: "desc" } },
  riskAssessment: true,
  complianceChecks: { orderBy: { createdAt: "desc" } },
  assignments: { orderBy: { createdAt: "asc" } },
  auditEvents: { orderBy: { createdAt: "desc" } },
  certificate: true,
} as const;
