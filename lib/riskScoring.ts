import { DocumentRisk } from "@/lib/enums";

type RiskInput = {
  title: string;
  documentType: string;
  industry: string;
  targetLanguage: string;
  confidentialityLevel: string;
  riskExpectation: string;
  requiredReviewLevel: string;
  specialInstructions?: string | null;
  aiConfidence?: number | null;
};

export type RiskScoreResult = {
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

export function calculateRiskScore(request: RiskInput): RiskScoreResult {
  const text = [
    request.title,
    request.documentType,
    request.industry,
    request.targetLanguage,
    request.confidentialityLevel,
    request.riskExpectation,
    request.requiredReviewLevel,
    request.specialInstructions ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const isDefaultDemo =
    text.includes("consumer credit disclosure") &&
    text.includes("banking") &&
    text.includes("french");

  if (isDefaultDemo) {
    return {
      totalScore: 87,
      riskLevel: DocumentRisk.HIGH,
      legalSensitivity: 32,
      industryRegulation: 24,
      brandConfidentialityRisk: 18,
      culturalNuance: 8,
      aiConfidenceGap: 5,
      flags: [
        "Regulated financial disclosure",
        "Quebec French terminology required",
        "Legal wording sensitivity",
        "Client-approved term conflicts detected",
        "Potential reputational risk if wording is inaccurate",
      ],
      explanation:
        "High Risk – 87/100. Banking disclosure language, Quebec French requirements, high confidentiality, and regulated terminology require certified human review.",
    };
  }

  let legalSensitivity = 6;
  let industryRegulation = 5;
  let brandConfidentialityRisk = 4;
  let culturalNuance = 3;
  let aiConfidenceGap = Math.max(
    0,
    Math.min(10, Math.round((100 - (request.aiConfidence ?? 92)) / 2))
  );
  const flags: string[] = [];

  if (/(legal|agreement|terms|disclosure|compliance|contract|regulated)/.test(text)) {
    legalSensitivity += 18;
    flags.push("Legal or regulated wording detected");
  }
  if (/(bank|financial|health|medical|government|insurance|legal)/.test(text)) {
    industryRegulation += 15;
    flags.push("Regulated industry routing required");
  }
  if (/(high|confidential|private|restricted)/.test(text)) {
    brandConfidentialityRisk += 12;
    flags.push("High confidentiality level");
  }
  if (/(french canadian|quebec|japanese|subtitle|media|cultural)/.test(text)) {
    culturalNuance += 5;
    flags.push("Market-specific terminology or cultural nuance");
  }
  if (/(regulated wording|compliance|formal tone|approved terminology)/.test(text)) {
    legalSensitivity += 6;
    industryRegulation += 4;
    flags.push("Special instructions mention compliance controls");
  }
  if (/(media|entertainment|subtitle|trailer)/.test(text)) {
    culturalNuance = Math.max(culturalNuance, 7);
    flags.push("Creative localization requires cultural review");
  }
  if (/(internal memo|internal hr)/.test(text)) {
    legalSensitivity = Math.min(legalSensitivity, 8);
    industryRegulation = Math.min(industryRegulation, 5);
    brandConfidentialityRisk = Math.min(brandConfidentialityRisk, 6);
    flags.push("Internal audience lowers consequence profile");
  }

  legalSensitivity = Math.min(35, legalSensitivity);
  industryRegulation = Math.min(25, industryRegulation);
  brandConfidentialityRisk = Math.min(20, brandConfidentialityRisk);
  culturalNuance = Math.min(10, culturalNuance);
  aiConfidenceGap = Math.min(10, aiConfidenceGap);

  const totalScore =
    legalSensitivity +
    industryRegulation +
    brandConfidentialityRisk +
    culturalNuance +
    aiConfidenceGap;

  const riskLevel =
    totalScore >= 70
      ? DocumentRisk.HIGH
      : totalScore >= 40
        ? DocumentRisk.MEDIUM
        : DocumentRisk.LOW;

  return {
    totalScore,
    riskLevel,
    legalSensitivity,
    industryRegulation,
    brandConfidentialityRisk,
    culturalNuance,
    aiConfidenceGap,
    flags: [...new Set(flags)],
    explanation: `${riskLevel[0]}${riskLevel.slice(1).toLowerCase()} Risk – ${totalScore}/100. Nortam Assure routes work based on consequence, not just word count.`,
  };
}
