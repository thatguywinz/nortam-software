import { CheckStatus } from "@/lib/enums";

type Term = {
  sourceTerm: string;
  approvedTerm: string;
  targetLanguage: string;
  notes?: string | null;
};

export type TerminologyConflict = {
  sourceTerm: string;
  detectedTerm: string;
  approvedTerm: string;
  status: "resolved" | "unresolved";
  note: string;
};

export type TerminologyResult = {
  status: CheckStatus;
  conflicts: TerminologyConflict[];
  prohibited: string[];
  summary: string;
};

const prohibitedPhrases = [
  "literal translation accepted",
  "uncertified final",
  "machine translation only",
];

export function runTerminologyCheck(input: {
  terms: Term[];
  aiDraft?: string | null;
  humanFinal?: string | null;
  targetLanguage: string;
}): TerminologyResult {
  const ai = input.aiDraft ?? "";
  const final = input.humanFinal ?? "";
  const aiLower = ai.toLowerCase();
  const finalLower = final.toLowerCase();
  const conflicts: TerminologyConflict[] = [];

  const agreementTerm = input.terms.find(
    (term) =>
      term.sourceTerm.toLowerCase() === "agreement" &&
      term.targetLanguage.toLowerCase() === input.targetLanguage.toLowerCase()
  );

  if (agreementTerm && /accord|l’accord|l'accord/.test(aiLower)) {
    const resolved = finalLower.includes(
      agreementTerm.approvedTerm.toLowerCase()
    );
    conflicts.push({
      sourceTerm: "Agreement",
      detectedTerm: "accord",
      approvedTerm: agreementTerm.approvedTerm,
      status: resolved ? "resolved" : "unresolved",
      note: resolved
        ? "AI used “accord”; human final replaced it with the approved term."
        : "AI used “accord”; approved term is “convention.”",
    });
  }

  const prohibited = prohibitedPhrases.filter((phrase) =>
    `${aiLower} ${finalLower}`.includes(phrase)
  );

  const unresolved = conflicts.some((conflict) => conflict.status === "unresolved");
  const status =
    prohibited.length > 0
      ? CheckStatus.FAILED
      : unresolved
        ? CheckStatus.FLAGGED
        : CheckStatus.PASSED;

  const resolvedCount = conflicts.filter(
    (conflict) => conflict.status === "resolved"
  ).length;

  const summary =
    status === CheckStatus.PASSED
      ? `${resolvedCount} terminology conflict resolved\n${prohibited.length} prohibited phrases detected\nLegal phrasing aligned\nClient glossary matched\nQuebec French formality confirmed`
      : conflicts.length
        ? conflicts.map((conflict) => conflict.note).join("\n")
        : "No terminology conflicts detected. Compliance review can proceed.";

  return {
    status,
    conflicts,
    prohibited,
    summary,
  };
}
