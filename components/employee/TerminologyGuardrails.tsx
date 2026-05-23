"use client";

import { motion } from "framer-motion";
import { AlertCircle, Bookmark, Check } from "lucide-react";
import { approvedGlossary } from "@/lib/mockData";

const resolved = [
  "1 terminology conflict resolved",
  "0 prohibited phrases detected",
  "Legal phrasing aligned",
  "Client glossary matched",
  "Quebec French formality confirmed",
];

export default function TerminologyGuardrails() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Guardrails
          </div>
          <h2 className="font-serif text-lg text-ink">
            Terminology & Compliance Guardrails
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
          <Check className="h-3 w-3" />
          Resolved
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-5 py-4 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <Bookmark className="h-3.5 w-3.5 text-brand-blue" />
            <span className="font-medium text-ink">
              Approved client terminology
            </span>
          </div>
          <div className="mt-2 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">English</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Approved French Canadian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approvedGlossary.map((g) => (
                  <tr key={g.english}>
                    <td className="px-3 py-2 text-ink">{g.english}</td>
                    <td className="px-3 py-2 font-medium text-ink">
                      {g.approved}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <div className="font-medium text-amber-800">
                  Detected issue
                </div>
                <div className="mt-0.5 text-amber-700">
                  AI used{" "}
                  <span className="rounded bg-amber-100 px-1 text-amber-900">
                    accord
                  </span>{" "}
                  — approved term is{" "}
                  <span className="rounded bg-emerald-100 px-1 text-emerald-800">
                    convention
                  </span>
                  .
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-1.5">
            {resolved.map((r, i) => (
              <motion.li
                key={r}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="flex items-center gap-2 text-sm text-ink"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                  <Check className="h-2.5 w-2.5" />
                </span>
                {r}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
