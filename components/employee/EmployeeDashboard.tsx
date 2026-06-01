import {
  Award,
  ClipboardList,
  FileText,
  Gauge,
  Inbox,
  Languages,
  LayoutDashboard,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { CertificateStatus, DocumentRisk, RequestStatus } from "@/lib/enums";
import DashboardTabs, { type DashboardSection } from "@/components/DashboardTabs";
import MetricCard from "@/components/MetricCard";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import WorkflowPipeline from "@/components/WorkflowPipeline";
import AuditTrailPanel from "@/components/employee/AuditTrailPanel";
import CertificateIssuer from "@/components/employee/CertificateIssuer";
import EmployeeQueue from "@/components/employee/EmployeeQueue";
import HumanReviewEditor from "@/components/employee/HumanReviewEditor";
import RiskAssessmentPanel from "@/components/employee/RiskAssessmentPanel";
import TerminologyPanel from "@/components/employee/TerminologyPanel";
import WorkflowActions from "@/components/employee/WorkflowActions";
import { formatBytes, formatDateTime, riskLabel, statusLabel } from "@/lib/formatters";
import type { RequestView } from "@/lib/viewModels";
import { workflowSteps } from "@/lib/workflow";

export default function EmployeeDashboard({
  requests,
  selected,
}: {
  requests: RequestView[];
  selected: RequestView;
}) {
  const highRisk = requests.filter((request) => request.riskLevel === DocumentRisk.HIGH).length;
  const activeTasks = requests.filter((request) => request.status !== RequestStatus.COMPLETED).length;
  const issued = requests.filter((request) => request.certificateStatus === CertificateStatus.ISSUED).length;

  const steps = workflowSteps({
    currentStage: selected.currentStage,
    status: selected.status,
    certificateStatus: selected.certificateStatus,
    riskScore: selected.riskScore,
  });

  const sections: DashboardSection[] = [
    {
      key: "overview",
      label: "Command Center",
      icon: <LayoutDashboard className="h-4 w-4" />,
      node: (
        <div className="space-y-6">
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <MetricCard index={0} label="Faster Turnaround" value={42} suffix="%" hint="AI drafting + smart routing" accent="green" icon={<Gauge className="h-4 w-4" />} />
            <MetricCard index={1} label="Active Review Tasks" value={activeTasks} hint="Across request queue" accent="blue" icon={<ClipboardList className="h-4 w-4" />} />
            <MetricCard index={2} label="Terminology Consistency" value={96} suffix="%" hint="Client glossary match" accent="ink" icon={<Languages className="h-4 w-4" />} />
            <MetricCard index={3} label="Trust Certificates" value={issued} hint="Issued in database" accent="gold" icon={<Award className="h-4 w-4" />} />
            <MetricCard index={4} label="High-Risk Queue" value={highRisk} hint="Routed to experts" accent="red" icon={<ShieldAlert className="h-4 w-4" />} />
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">Internal Workflow Pipeline</div>
                <h2 className="mt-0.5 font-serif text-lg text-ink">{selected.title}</h2>
                <div className="mt-1 text-xs text-ink-muted">
                  Client Request → AI First Draft → Risk Intelligence → Human Review → Terminology Check → Compliance Approval → Nortam Trust Certificate
                </div>
              </div>
              <StatusBadge tone={selected.status === RequestStatus.COMPLETED ? "complete" : "in-progress"}>
                {statusLabel(selected.status)}
              </StatusBadge>
            </div>
            <div className="px-5 py-6">
              <WorkflowPipeline steps={steps} />
            </div>
          </section>

          <Inspector request={selected} />
        </div>
      ),
    },
    {
      key: "queue",
      label: "Queue",
      icon: <Inbox className="h-4 w-4" />,
      node: <EmployeeQueue requests={requests} selectedId={selected.id} />,
    },
    {
      key: "review",
      label: "Human Review",
      icon: <ClipboardList className="h-4 w-4" />,
      node: (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-panel-card p-5 shadow-panel">
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">Workflow Actions</div>
            <p className="mt-1 mb-3 text-sm text-ink-muted">
              Advance {selected.title} through the certified review pipeline. Buttons unlock as each prerequisite is met.
            </p>
            <WorkflowActions request={selected} />
          </div>
          <HumanReviewEditor request={selected} />
        </div>
      ),
    },
    {
      key: "risk",
      label: "Risk Intelligence",
      icon: <ShieldAlert className="h-4 w-4" />,
      node: <RiskAssessmentPanel request={selected} />,
    },
    {
      key: "terminology",
      label: "Terminology",
      icon: <ShieldCheck className="h-4 w-4" />,
      node: (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TerminologyPanel request={selected} />
          </div>
          <div className="rounded-xl border border-border bg-panel-card p-5 shadow-panel">
            <div className="flex items-center gap-2 text-xs font-medium text-ink">
              <ShieldCheck className="h-4 w-4 text-brand-green" />
              Client-visible proof
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Clients see the same persisted workflow status and certificate issuance after employee actions complete. AI creates speed. Human review creates trust.
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "certificate",
      label: "Certificate",
      icon: <Award className="h-4 w-4" />,
      node: <CertificateIssuer request={selected} />,
    },
    {
      key: "audit",
      label: "Audit Trail",
      icon: <ScrollText className="h-4 w-4" />,
      node: <AuditTrailPanel request={selected} />,
    },
  ];

  const header = (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Nortam Review Operations
        </div>
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink">
          Nortam Assure Command Center
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
          AI-assisted translation, human-verified review, and certified auditability for high-stakes localization.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
        <ShieldAlert className="h-3 w-3" />
        {highRisk} high-risk in queue
      </div>
    </div>
  );

  return <DashboardTabs sections={sections} defaultView="overview" header={header} />;
}

function Inspector({ request }: { request: RequestView }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
      <div className="border-b border-border px-5 py-3.5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          Request Detail / Inspector
        </div>
        <h2 className="mt-0.5 font-serif text-lg text-ink">{request.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {request.riskLevel && <RiskBadge risk={riskLabel(request.riskLevel) as any} />}
          <StatusBadge tone="in-progress">{statusLabel(request.status)}</StatusBadge>
          <span className="text-[11px] text-ink-muted">{request.requestCode}</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border px-5 py-4 text-sm">
        <Field label="Client" value={request.organizationName} />
        <Field label="Document type" value={request.documentType} />
        <Field label="Source" value={request.sourceLanguage} />
        <Field label="Target" value={request.targetLanguage} />
        <Field label="Industry" value={request.industry} />
        <Field label="Deadline" value={formatDateTime(request.deadline)} />
        <Field label="AI confidence" value={request.aiConfidence ? `${request.aiConfidence}%` : "Pending"} />
        <Field label="Certificate" value={request.certificateStatus} />
        <Field
          label="Uploaded asset"
          value={
            request.assets[0]
              ? `${request.assets[0].fileName} (${formatBytes(request.assets[0].fileSize)})`
              : "Source text paste"
          }
          full
        />
      </dl>

      <div className="border-b border-border bg-amber-50/30 px-5 py-3 text-xs leading-relaxed text-ink">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
          Routing principle
        </div>
        Nortam Assure routes work based on consequence, not just word count.
      </div>

      <div className="border-b border-border px-5 py-4">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          Assigned review team
        </div>
        <div className="space-y-2">
          {request.assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm">
              <span className="font-medium text-ink">{assignment.reviewerName}</span>
              <span className="text-xs text-ink-muted">
                {assignment.reviewerRole} · {assignment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <WorkflowActions request={request} />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
