import {
  Activity,
  Award,
  FileStack,
  Files,
  Hourglass,
  LayoutDashboard,
  Send,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { CertificateStatus, RequestStatus, VersionType } from "@/lib/enums";
import CertificateViewer from "@/components/CertificateViewer";
import DashboardTabs, { type DashboardSection } from "@/components/DashboardTabs";
import MetricCard from "@/components/MetricCard";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import WorkflowPipeline from "@/components/WorkflowPipeline";
import NewRequestForm from "@/components/client/NewRequestForm";
import { formatBytes, formatDateTime, riskLabel, statusLabel } from "@/lib/formatters";
import type { RequestView } from "@/lib/viewModels";
import { workflowSteps } from "@/lib/workflow";

export default function ClientDashboard({
  organizationName,
  requests,
}: {
  organizationName: string;
  requests: RequestView[];
}) {
  const active = requests[0] ?? null;
  const activeCount = requests.filter(
    (request) => request.status !== RequestStatus.COMPLETED
  ).length;
  const pendingApprovals = requests.filter(
    (request) => request.status === RequestStatus.CLIENT_APPROVAL
  ).length;
  const issuedCertificates = requests.filter(
    (request) => request.certificateStatus === CertificateStatus.ISSUED
  ).length;

  const sections: DashboardSection[] = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
      node: (
        <div className="space-y-6">
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard index={0} label="Active Requests" value={activeCount} hint="In the review pipeline" accent="blue" icon={<FileStack className="h-4 w-4" />} />
            <MetricCard index={1} label="Pending Approvals" value={pendingApprovals} hint="Ready for client visibility" accent="amber" icon={<Hourglass className="h-4 w-4" />} />
            <MetricCard index={2} label="Certificates Issued" value={issuedCertificates} hint="Nortam Trust Certificates" accent="gold" icon={<Award className="h-4 w-4" />} />
            <MetricCard index={3} label="Avg Turnaround Saved" value={42} suffix="%" hint="AI drafting plus human routing" accent="green" icon={<TrendingUp className="h-4 w-4" />} />
          </section>
          {active ? <ClientStatusPanel request={active} /> : <EmptyState />}
        </div>
      ),
    },
    {
      key: "new",
      label: "New Request",
      icon: <Send className="h-4 w-4" />,
      node: (
        <div className="mx-auto max-w-2xl">
          <NewRequestForm />
        </div>
      ),
    },
    {
      key: "documents",
      label: "My Documents",
      icon: <Files className="h-4 w-4" />,
      node: <ClientRequestList requests={requests} />,
    },
    {
      key: "certificates",
      label: "Certificates",
      icon: <Award className="h-4 w-4" />,
      node: <CertificateViewer requests={requests} />,
    },
    {
      key: "activity",
      label: "Activity",
      icon: <Activity className="h-4 w-4" />,
      node: <RecentActivity request={active} />,
    },
  ];

  const header = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          {organizationName}
        </div>
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink">
          Client Translation Portal
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
          Submit high-stakes translation requests, track expert review, and access certified outputs in one secure workspace.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
        <ShieldCheck className="h-3 w-3" />
        Confidential client workspace
      </div>
    </div>
  );

  return <DashboardTabs sections={sections} defaultView="overview" header={header} />;
}

export function ClientStatusPanel({ request }: { request: RequestView }) {
  const sourceVersion = request.versions.find(
    (version) => version.type === VersionType.SOURCE_EXTRACT
  );
  const finalVersion = request.versions.find(
    (version) => version.type === VersionType.HUMAN_FINAL
  );

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Live Project Status
          </div>
          <h2 className="mt-0.5 font-serif text-lg text-ink">{request.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
            <span>Request ID {request.requestCode}</span>
            <span aria-hidden>·</span>
            <span>Deadline {formatDateTime(request.deadline)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {request.riskLevel && <RiskBadge risk={riskLabel(request.riskLevel) as any} />}
          <StatusBadge tone={request.status === RequestStatus.COMPLETED ? "complete" : "in-progress"}>
            {statusLabel(request.status)}
          </StatusBadge>
        </div>
      </div>

      <div className="px-5 py-6">
        <WorkflowPipeline
          steps={workflowSteps({
            currentStage: request.currentStage,
            status: request.status,
            certificateStatus: request.certificateStatus,
            riskScore: request.riskScore,
          })}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-border bg-slate-50/60 px-5 py-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-3">
          <div className="text-xs text-ink-muted">Client-visible status</div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">
            Nortam Assure routes work based on consequence, not just word count. Current stage: {statusLabel(request.status)}.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-3">
          <div className="text-xs text-ink-muted">Latest deliverable</div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">
            {finalVersion?.content ??
              sourceVersion?.content ??
              "The review team has not posted a final version yet."}
          </p>
        </div>
      </div>
    </section>
  );
}

function ClientRequestList({ requests }: { requests: RequestView[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">Documents</div>
          <h2 className="font-serif text-lg text-ink">My Documents / Requests</h2>
        </div>
        <div className="text-xs text-ink-muted">{requests.length} total</div>
      </div>
      <ul className="divide-y divide-border">
        {requests.map((request) => (
          <li key={request.id}>
            <Link
              href={`/client/requests/${request.id}`}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-slate-50"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-ink">{request.title}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-muted">
                  <span>{request.sourceLanguage} to {request.targetLanguage}</span>
                  <span aria-hidden>·</span>
                  <span>{request.requestCode}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {request.assets[0]
                      ? `${request.assets[0].fileName} (${formatBytes(request.assets[0].fileSize)})`
                      : "Source text pasted"}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {request.riskLevel && <RiskBadge risk={riskLabel(request.riskLevel) as any} />}
                <StatusBadge tone={request.status === RequestStatus.COMPLETED ? "complete" : "in-progress"}>
                  {statusLabel(request.status)}
                </StatusBadge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentActivity({ request }: { request: RequestView | null }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
      <div className="border-b border-border px-5 py-3.5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">Recent Activity</div>
        <h2 className="font-serif text-lg text-ink">Audit-backed updates</h2>
      </div>
      <div className="divide-y divide-border">
        {(request?.auditEvents ?? []).length === 0 && (
          <div className="px-5 py-6 text-sm text-ink-muted">No activity recorded yet.</div>
        )}
        {(request?.auditEvents ?? []).slice(0, 12).map((event) => (
          <div key={event.id} className="flex gap-3 px-5 py-3 text-sm">
            <div className="mt-1 h-2 w-2 rounded-full bg-brand-blue" />
            <div>
              <div className="font-medium text-ink">{event.action}</div>
              <div className="mt-0.5 text-xs text-ink-muted">
                {new Date(event.createdAt).toLocaleString()} · Actor: {event.actor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="rounded-xl border border-border bg-panel-card p-6 shadow-panel">
      <h2 className="font-serif text-xl text-ink">No requests yet</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Submit a request to start the Nortam Assure workflow.
      </p>
    </section>
  );
}
