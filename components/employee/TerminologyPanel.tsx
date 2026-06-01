import { BookmarkCheck, ShieldCheck } from "lucide-react";
import { CheckStatus } from "@/lib/enums";
import StatusBadge from "@/components/StatusBadge";
import type { RequestView } from "@/lib/viewModels";

export default function TerminologyPanel({ request }: { request: RequestView }) {
  const latest = request.complianceChecks[0];

  return (
    <section
      id="terminology"
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Terminology & Compliance
          </div>
          <h2 className="font-serif text-lg text-ink">
            Client glossary guardrails
          </h2>
        </div>
        <StatusBadge
          tone={latest?.status === CheckStatus.PASSED ? "complete" : "pending"}
        >
          {latest?.status ?? "Pending"}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="border-b border-border p-5 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-ink">
            <BookmarkCheck className="h-4 w-4 text-brand-blue" />
            Approved terminology
          </div>
          <div className="space-y-2">
            {request.terminology.length ? (
              request.terminology.map((term) => (
                <div
                  key={term.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="text-ink-muted">{term.sourceTerm}</span>
                  <span className="font-medium text-ink">{term.approvedTerm}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-ink-muted">
                No client terminology terms are configured.
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-ink">
            <ShieldCheck className="h-4 w-4 text-brand-green" />
            Latest compliance result
          </div>
          {latest ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-800">
                {latest.summary.split("\n").map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              {latest.conflicts.length > 0 && (
                <div className="space-y-2">
                  {latest.conflicts.map((conflict: any, index) => (
                    <div
                      key={`${conflict.sourceTerm}-${index}`}
                      className="rounded-lg border border-border bg-white p-3 text-xs text-ink"
                    >
                      AI used &quot;{conflict.detectedTerm}&quot;. Approved term is
                      &quot;{conflict.approvedTerm}&quot;.
                      <div className="mt-1 font-medium text-emerald-700">
                        Status: {conflict.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-800">
              Run the checker after saving a human final. The MapleBank demo
              detects that the AI used &quot;accord&quot; while the approved term is
              &quot;convention.&quot;
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
