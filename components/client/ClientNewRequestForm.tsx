"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Lock,
  Paperclip,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useAssure } from "@/lib/store";

const initialState = {
  title: "Consumer Credit Disclosure – French Canada",
  docType: "Regulated financial disclosure",
  industry: "Banking / Financial Services",
  source: "English",
  target: "French Canadian",
  deadline: "Today, 5:00 PM",
  confidentiality: "High",
  riskExpectation: "High",
  reviewLevel: "Legal translator + compliance editor",
  glossary: "MapleBank — Quebec Disclosure Glossary v3.2",
  instructions:
    "Use approved Quebec French legal terminology. Maintain formal tone. Flag any clauses where literal translation may create compliance risk.",
};

export default function ClientNewRequestForm() {
  const { submitNewRequest } = useAssure();
  const [state, setState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      submitNewRequest();
      setSubmitting(false);
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Intake
          </div>
          <h2 className="font-serif text-lg text-ink">New Translation Request</h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 ring-1 ring-slate-200">
          <Lock className="h-3 w-3" />
          Confidential
        </div>
      </div>

      <form className="space-y-4 p-5" onSubmit={onSubmit}>
        <Field label="Project title">
          <input
            value={state.title}
            onChange={(e) => setState({ ...state, title: e.target.value })}
            className="form-input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Document type">
            <select
              value={state.docType}
              onChange={(e) => setState({ ...state, docType: e.target.value })}
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
            <select
              value={state.industry}
              onChange={(e) =>
                setState({ ...state, industry: e.target.value })
              }
              className="form-input"
            >
              <option>Banking / Financial Services</option>
              <option>Healthcare / MedTech</option>
              <option>Retail</option>
              <option>Cloud / SaaS</option>
              <option>Media & Entertainment</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Source language">
            <select
              value={state.source}
              onChange={(e) => setState({ ...state, source: e.target.value })}
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
              value={state.target}
              onChange={(e) => setState({ ...state, target: e.target.value })}
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

        <div className="grid grid-cols-2 gap-3">
          <Field label="Deadline">
            <input
              value={state.deadline}
              onChange={(e) =>
                setState({ ...state, deadline: e.target.value })
              }
              className="form-input"
            />
          </Field>
          <Field label="Confidentiality">
            <select
              value={state.confidentiality}
              onChange={(e) =>
                setState({ ...state, confidentiality: e.target.value })
              }
              className="form-input"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Standard</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Risk expectation">
            <select
              value={state.riskExpectation}
              onChange={(e) =>
                setState({ ...state, riskExpectation: e.target.value })
              }
              className="form-input"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </Field>
          <Field label="Required review level">
            <select
              value={state.reviewLevel}
              onChange={(e) =>
                setState({ ...state, reviewLevel: e.target.value })
              }
              className="form-input"
            >
              <option>Legal translator + compliance editor</option>
              <option>Subject-matter translator</option>
              <option>AI-assisted with human spot-check</option>
            </select>
          </Field>
        </div>

        <Field label="Approved glossary">
          <select
            value={state.glossary}
            onChange={(e) => setState({ ...state, glossary: e.target.value })}
            className="form-input"
          >
            <option>MapleBank — Quebec Disclosure Glossary v3.2</option>
            <option>MapleBank — Consumer Banking Glossary v2.1</option>
            <option>Use default Nortam glossary</option>
          </select>
        </Field>

        <Field label="Special instructions">
          <textarea
            rows={3}
            value={state.instructions}
            onChange={(e) =>
              setState({ ...state, instructions: e.target.value })
            }
            className="form-input resize-none leading-relaxed"
          />
        </Field>

        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            Document upload
          </div>
          <div className="mt-1.5 flex items-center justify-between rounded-lg border border-dashed border-border bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white ring-1 ring-border">
                <FileText className="h-4 w-4 text-brand-blue" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-ink">
                  consumer-credit-disclosure-en.pdf
                </div>
                <div className="text-xs text-ink-muted">
                  2.4 MB · Encrypted at rest
                </div>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1 text-xs text-ink-muted hover:text-ink"
            >
              <Paperclip className="h-3 w-3" />
              Replace
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
            <div>
              Flagged as <strong>High risk</strong> — regulated financial
              disclosure with Quebec French requirements. Nortam Assure will
              route this to a certified legal translator.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-shell-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-shell-800 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" />
              Submitting to Nortam Assure…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Submit to Nortam Assure
            </>
          )}
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
    </motion.div>
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
