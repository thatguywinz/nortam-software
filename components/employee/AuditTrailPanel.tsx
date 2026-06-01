import { ScrollText } from "lucide-react";
import type { RequestView } from "@/lib/viewModels";

export default function AuditTrailPanel({ request }: { request: RequestView }) {
  return (
    <section
      id="audit"
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Audit Trail
          </div>
          <h2 className="font-serif text-lg text-ink">
            Every meaningful action
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-700 ring-1 ring-slate-200">
          <ScrollText className="h-3 w-3" />
          Persistent
        </div>
      </div>
      <div className="divide-y divide-border">
        {request.auditEvents.map((event) => (
          <div key={event.id} className="grid gap-2 px-5 py-3 text-sm md:grid-cols-[150px_1fr]">
            <div className="text-xs text-ink-muted">
              {new Date(event.createdAt).toLocaleString()}
            </div>
            <div>
              <div className="font-medium text-ink">{event.action}</div>
              <div className="mt-0.5 text-xs text-ink-muted">
                Actor: {event.actor} · Status: {event.status}
              </div>
              {event.metadata ? (
                <pre className="mt-2 overflow-auto rounded-md bg-slate-50 p-2 text-[11px] text-ink-muted">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border bg-slate-50/70 px-5 py-3 text-[11px] text-ink-muted">
        Every AI output, human edit, approval, and timestamp is captured.
      </div>
    </section>
  );
}
