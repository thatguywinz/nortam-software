"use client";

import { FileText, Paperclip, ShieldAlert, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createTranslationRequestAction } from "@/lib/actions";

const defaults = {
  title: "Consumer Credit Disclosure – French Canada",
  documentType: "Regulated financial disclosure",
  industry: "Banking / Financial Services",
  sourceLanguage: "English",
  targetLanguage: "French Canadian",
  confidentialityLevel: "High",
  riskExpectation: "High",
  requiredReviewLevel: "Legal translator + compliance editor",
  glossary: "MapleBank — Quebec Disclosure Glossary v3.2",
  sourceText:
    "The client must understand all fees before signing the agreement.",
  specialInstructions:
    "Use approved Quebec French legal terminology. Maintain formal tone. Flag any clauses where literal translation may create compliance risk.",
};

export default function NewRequestForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  return (
    <section
      id="new-request"
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Intake
          </div>
          <h2 className="font-serif text-lg text-ink">New Translation Request</h2>
        </div>
        <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
          Protected
        </div>
      </div>

      <form
        ref={formRef}
        className="space-y-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setError("");
          startTransition(async () => {
            const result = await createTranslationRequestAction(formData);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            formRef.current?.reset();
            router.push(`/client/requests/${result.requestId}`);
            router.refresh();
          });
        }}
      >
        <Field label="Project title">
          <input name="title" defaultValue={defaults.title} className="form-input" />
        </Field>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Document type">
            <select
              name="documentType"
              defaultValue={defaults.documentType}
              className="form-input"
            >
              <option>Regulated financial disclosure</option>
              <option>Customer-facing fee notice</option>
              <option>Terms of use</option>
              <option>Internal HR communication</option>
              <option>Medical device label</option>
              <option>Subtitle file</option>
            </select>
          </Field>
          <Field label="Industry">
            <select name="industry" defaultValue={defaults.industry} className="form-input">
              <option>Banking / Financial Services</option>
              <option>Healthcare / MedTech</option>
              <option>Retail</option>
              <option>Cloud / SaaS</option>
              <option>Media & Entertainment</option>
              <option>Legal Services</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Source language">
            <select
              name="sourceLanguage"
              defaultValue={defaults.sourceLanguage}
              className="form-input"
            >
              <option>English</option>
              <option>French Canadian</option>
              <option>Spanish</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </Field>
          <Field label="Target language">
            <select
              name="targetLanguage"
              defaultValue={defaults.targetLanguage}
              className="form-input"
            >
              <option>French Canadian</option>
              <option>English</option>
              <option>Spanish</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Deadline">
            <input name="deadline" type="datetime-local" className="form-input" />
          </Field>
          <Field label="Confidentiality">
            <select
              name="confidentialityLevel"
              defaultValue={defaults.confidentialityLevel}
              className="form-input"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Standard</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Risk expectation">
            <select
              name="riskExpectation"
              defaultValue={defaults.riskExpectation}
              className="form-input"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </Field>
          <Field label="Required review level">
            <select
              name="requiredReviewLevel"
              defaultValue={defaults.requiredReviewLevel}
              className="form-input"
            >
              <option>Legal translator + compliance editor</option>
              <option>Subject-matter translator</option>
              <option>AI-assisted with human spot-check</option>
            </select>
          </Field>
        </div>

        <Field label="Glossary selection">
          <select name="glossary" defaultValue={defaults.glossary} className="form-input">
            <option>MapleBank — Quebec Disclosure Glossary v3.2</option>
            <option>MapleBank — Consumer Banking Glossary v2.1</option>
            <option>Use default Nortam glossary</option>
          </select>
        </Field>

        <Field label="Special instructions">
          <textarea
            name="specialInstructions"
            rows={3}
            defaultValue={defaults.specialInstructions}
            className="form-input resize-none leading-relaxed"
          />
        </Field>

        <Field label="Source text">
          <textarea
            name="sourceText"
            rows={3}
            defaultValue={defaults.sourceText}
            className="form-input resize-none font-serif leading-relaxed"
          />
        </Field>

        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
            Document upload
          </span>
          <div className="mt-1.5 flex items-center justify-between rounded-lg border border-dashed border-border bg-slate-50 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white ring-1 ring-border">
                <FileText className="h-4 w-4 text-brand-blue" />
              </div>
              <div className="min-w-0 text-sm">
                <div className="truncate font-medium text-ink">
                  {fileName || "Upload PDF, DOCX, DOC, or TXT"}
                </div>
                <div className="text-xs text-ink-muted">
                  Max 8 MB. TXT text is extracted automatically.
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-xs text-ink-muted">
              <Paperclip className="h-3 w-3" />
              Browse
            </span>
          </div>
          <input
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,.txt,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => {
              setFileName(event.currentTarget.files?.[0]?.name ?? "");
            }}
          />
        </label>

        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-800">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
            <div>
              Built for documents where a translation error can become a legal,
              financial, or reputational risk.
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-shell-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-shell-800 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {isPending ? "Submitting..." : "Submit to Nortam Assure"}
        </button>
      </form>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 8px 10px;
          font-size: 13px;
          color: #0f172a;
        }
        :global(.form-input:focus) {
          outline: none;
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
