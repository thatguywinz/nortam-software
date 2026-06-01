import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().trim().min(3, "Project title is required."),
  documentType: z.string().trim().min(2, "Document type is required."),
  industry: z.string().trim().min(2, "Industry is required."),
  sourceLanguage: z.string().trim().min(2, "Source language is required."),
  targetLanguage: z.string().trim().min(2, "Target language is required."),
  deadline: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  confidentialityLevel: z
    .string()
    .trim()
    .min(2, "Confidentiality level is required."),
  riskExpectation: z.string().trim().min(2, "Risk expectation is required."),
  requiredReviewLevel: z
    .string()
    .trim()
    .min(2, "Required review level is required."),
  specialInstructions: z.string().trim().optional(),
  glossary: z.string().trim().optional(),
  sourceText: z.string().trim().optional(),
});

export const humanReviewSchema = z.object({
  finalContent: z
    .string()
    .trim()
    .min(1, "Final translation cannot be empty."),
  notes: z.string().trim().optional(),
});

export const messageSchema = z.object({
  body: z.string().trim().min(1).max(2000),
});

export function parseDeadline(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}
