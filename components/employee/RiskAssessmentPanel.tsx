import { ShieldAlert } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { riskLabel } from "@/lib/formatters";
import type { RequestView } from "@/lib/viewModels";

export default function RiskAssessmentPanel({ request }: { request: RequestView }) {
  const risk = request.riskAssessment;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Risk Intelligence
          </div>
          <h2 className="font-serif text-lg text-ink">Rule-based routing</h2>
        </div>
        {request.riskLevel && <RiskBadge risk={riskLabel(request.riskLevel) as any} />}
      </div>

      {risk ? (
        <div className="p-5">
          <div className="flex items-baseline gap-2">
            <div className="font-serif text-4xl text-ink">{risk.totalScore}</div>
            <div className="text-sm text-ink-muted">/100</div>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {risk.explanation}
          </p>
          <div className="mt-5 space-y-2">
            <Bar label="Legal sensitivity" value={risk.legalSensitivity} max={35} />
            <Bar label="Industry regulation" value={risk.industryRegulation} max={25} />
            <Bar
              label="Brand/confidentiality risk"
              value={risk.brandConfidentialityRisk}
              max={20}
            />
            <Bar label="Cultural nuance" value={risk.culturalNuance} max={10} />
            <Bar label="AI confidence gap" value={risk.aiConfidenceGap} max={10} />
          </div>
          <ul className="mt-5 space-y-1.5">
            {risk.flags.map((flag) => (
              <li key={flag} className="flex items-start gap-2 text-xs text-ink">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 text-brand-red" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-5 text-sm text-ink-muted">
          Run risk scoring after the AI draft. The default MapleBank disclosure
          scores High Risk – 87/100.
        </div>
      )}
    </section>
  );
}

function Bar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="font-medium text-ink">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-brand-red"
          style={{ width: `${Math.round((value / max) * 100)}%` }}
        />
      </div>
    </div>
  );
}
