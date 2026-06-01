import { FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { VersionType } from "@/lib/enums";
import CertificateViewer from "@/components/CertificateViewer";
import { ClientStatusPanel } from "@/components/client/ClientDashboard";
import { formatBytes, formatDateTime } from "@/lib/formatters";
import type { RequestView } from "@/lib/viewModels";

export default function ClientRequestDetail({
  request,
}: {
  request: RequestView;
}) {
  const aiDraft = request.versions.find((version) => version.type === VersionType.AI_DRAFT);
  const humanFinal = request.versions.find((version) => version.type === VersionType.HUMAN_FINAL);

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link href="/client" className="text-xs font-medium text-brand-blue">
              Back to client portal
            </Link>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink">
              {request.title}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {request.requestCode} · {request.organizationName} · Updated{" "}
              {formatDateTime(request.updatedAt)}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
            <ShieldCheck className="h-3 w-3" />
            Connected to employee workflow
          </div>
        </div>

        <ClientStatusPanel request={request} />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Panel title="Uploaded Assets">
              {request.assets.length ? (
                <ul className="divide-y divide-border">
                  {request.assets.map((asset) => (
                    <li key={asset.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-brand-blue ring-1 ring-blue-200">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink">{asset.fileName}</div>
                        <div className="text-xs text-ink-muted">
                          {asset.fileType} · {formatBytes(asset.fileSize)} · Uploaded{" "}
                          {formatDateTime(asset.uploadedAt)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">Source text was pasted directly.</p>
              )}
            </Panel>

            <Panel title="Translation Versions">
              <div className="grid gap-3">
                <VersionBlock title="AI Draft" content={aiDraft?.content} />
                <VersionBlock title="Human-Verified Final" content={humanFinal?.content} />
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Risk Assessment">
              {request.riskAssessment ? (
                <div className="space-y-3 text-sm">
                  <div className="font-serif text-2xl text-ink">
                    {request.riskAssessment.riskLevel} · {request.riskAssessment.totalScore}/100
                  </div>
                  <p className="text-ink-muted">{request.riskAssessment.explanation}</p>
                  <ul className="space-y-1">
                    {request.riskAssessment.flags.map((flag) => (
                      <li key={flag} className="flex gap-2 text-xs text-ink">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-red" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-ink-muted">Risk scoring is pending.</p>
              )}
            </Panel>
            <CertificateViewer requests={[request]} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="font-serif text-lg text-ink">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function VersionBlock({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
        {title}
      </div>
      <p className="mt-2 font-serif text-sm leading-relaxed text-ink">
        {content ?? "Not available yet."}
      </p>
    </div>
  );
}
