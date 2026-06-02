type DraftInput = {
  title: string;
  sourceText?: string | null;
  sourceLanguage: string;
  targetLanguage: string;
  industry: string;
  documentType: string;
  specialInstructions?: string | null;
};

export type DraftResult = {
  content: string;
  provider: string;
  confidence: number;
};

function buildPrompt(input: DraftInput) {
  return [
    `Translate the following text from ${input.sourceLanguage} to ${input.targetLanguage}.`,
    `Industry context: ${input.industry}.`,
    `Document type: ${input.documentType}.`,
    input.specialInstructions
      ? `Special instructions: ${input.specialInstructions}.`
      : "",
    "Return ONLY the translated text — no preamble, no notes, no quotation marks.",
    "",
    `Source text:\n${input.sourceText ?? input.title}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const SYSTEM_PROMPT =
  "You are a professional, certified translator producing a high-quality first draft for expert human review. Preserve meaning, tone, formatting, and any legal or regulated terminology. Output only the translation.";

export async function generateAiDraft(input: DraftInput): Promise<DraftResult> {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasGoogle = Boolean(process.env.GOOGLE_GENAI_API_KEY);

  const useAnthropic =
    provider === "anthropic" || (provider === "auto" && hasAnthropic);
  const useOpenAI = provider === "openai" || (provider === "auto" && hasOpenAI);
  const useGoogle = provider === "google" || (provider === "auto" && hasGoogle);

  if (useAnthropic && hasAnthropic) {
    const result = await callAnthropic(input);
    if (result) return result;
  }

  if (useOpenAI && hasOpenAI) {
    const result = await callOpenAI(input);
    if (result) return result;
  }

  if (useGoogle && hasGoogle) {
    const result = await callGoogle(input);
    if (result) return result;
  }

  return {
    content: localDraft(input),
    provider: "Nortam local draft generator (mock)",
    confidence: 91,
  };
}

async function callAnthropic(input: DraftInput): Promise<DraftResult | null> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
        max_tokens: 2048,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildPrompt(input) }],
      }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    const content = json?.content?.[0]?.text;
    if (typeof content === "string" && content.trim()) {
      return {
        content: content.trim(),
        provider: `Anthropic ${json?.model ?? "Claude"}`,
        confidence: 94,
      };
    }
  } catch {
    // Fall through to the next provider / local fallback.
  }
  return null;
}

async function callOpenAI(input: DraftInput): Promise<DraftResult | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(input) },
        ],
      }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      return {
        content: content.trim(),
        provider: "OpenAI",
        confidence: 90,
      };
    }
  } catch {
    // Fall through to local fallback.
  }
  return null;
}

async function callGoogle(input: DraftInput): Promise<DraftResult | null> {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    const model = process.env.GOOGLE_MODEL ?? "gemini-2.0-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: {
              text: SYSTEM_PROMPT,
            },
          },
          contents: {
            parts: {
              text: buildPrompt(input),
            },
          },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) return null;
    const json = await response.json();
    const content = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof content === "string" && content.trim()) {
      return {
        content: content.trim(),
        provider: `Google ${model}`,
        confidence: 92,
      };
    }
  } catch {
    // Fall through to local fallback.
  }
  return null;
}

function localDraft(input: DraftInput) {
  const source = `${input.title} ${input.sourceText ?? ""}`.toLowerCase();
  const target = input.targetLanguage.toLowerCase();

  if (
    target.includes("french") &&
    /(consumer credit|fees|agreement|disclosure|client|sign)/.test(source)
  ) {
    return "Le client doit comprendre tous les frais avant de signer l’accord.";
  }
  if (target.includes("spanish")) {
    return "El empleado debe revisar el aviso interno antes de confirmar la recepción.";
  }
  if (target.includes("german")) {
    return "Der Anwender muss alle Sicherheitshinweise vor der Verwendung des Produkts lesen.";
  }
  if (target.includes("japanese")) {
    return "視聴者が物語の意図を自然に理解できるよう、字幕表現を市場に合わせて調整します。";
  }
  return `[${input.targetLanguage} draft] ${input.sourceText ?? input.title}`;
}
