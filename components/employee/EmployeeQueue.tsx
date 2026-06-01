"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CertificateStatus,
  DocumentRisk,
  RequestStatus,
} from "@/lib/enums";
import RiskBadge from "@/components/RiskBadge";
import StatusBadge from "@/components/StatusBadge";
import { riskLabel, statusLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { RequestView } from "@/lib/viewModels";

const filters = [
  { key: "all", label: "All" },
  { key: "high", label: "High Risk" },
  { key: "ai", label: "Awaiting AI Draft" },
  { key: "human", label: "Human Review" },
  { key: "compliance", label: "Compliance Check" },
  { key: "certificate", label: "Ready for Certificate" },
  { key: "completed", label: "Completed" },
];

export default function EmployeeQueue({
  requests,
  selectedId,
}: {
  requests: RequestView[];
  selectedId: string;
}) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return requests.filter((request) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        [
          request.title,
          request.organizationName,
          request.requestCode,
          request.sourceLanguage,
          request.targetLanguage,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      if (!matchesQuery) return false;
      if (filter === "high") return request.riskLevel === DocumentRisk.HIGH;
      if (filter === "ai") return request.status === RequestStatus.SUBMITTED;
      if (filter === "human") return request.status === RequestStatus.HUMAN_REVIEW;
      if (filter === "compliance") {
        return request.status === RequestStatus.COMPLIANCE_CHECK;
      }
      if (filter === "certificate") {
        return request.certificateStatus === CertificateStatus.READY;
      }
      if (filter === "completed") return request.status === RequestStatus.COMPLETED;
      return true;
    });
  }, [filter, query, requests]);

  return (
    <section
      id="queue"
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Operations
          </div>
          <h2 className="font-serif text-lg text-ink">Incoming Requests / Queue</h2>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search client, title, code, language"
            className="h-9 w-full rounded-lg border border-border bg-white pl-8 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-brand-blue/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border bg-slate-50/60 px-5 py-3">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition",
              filter === item.key
                ? "bg-shell-900 text-white ring-shell-900"
                : "bg-white text-ink-muted ring-border hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-2 border-b border-border bg-slate-50/60 px-5 py-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        <div className="col-span-5">Document</div>
        <div className="col-span-2">Pair</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Risk</div>
        <div className="col-span-2 text-right">Certificate</div>
      </div>
      <ul className="divide-y divide-border">
        {filtered.map((request) => {
          const active = request.id === selectedId;
          return (
            <li key={request.id}>
              <Link
                href={`/employee/requests/${request.id}`}
                className={cn(
                  "grid grid-cols-12 items-center gap-2 px-5 py-3 text-sm transition",
                  active ? "bg-blue-50/50" : "hover:bg-slate-50"
                )}
              >
                <div className="col-span-5 min-w-0">
                  <div className="truncate font-medium text-ink">{request.title}</div>
                  <div className="mt-0.5 text-[11px] text-ink-muted">
                    {request.organizationName} · {request.requestCode}
                  </div>
                </div>
                <div className="col-span-2 text-xs text-ink">
                  {request.sourceLanguage} to {request.targetLanguage}
                </div>
                <div className="col-span-2 text-xs text-ink">
                  {statusLabel(request.status)}
                </div>
                <div className="col-span-1">
                  {request.riskLevel ? (
                    <RiskBadge risk={riskLabel(request.riskLevel) as any} className="px-1.5 py-[1px]" />
                  ) : (
                    <StatusBadge tone="pending" withIcon={false}>Pending</StatusBadge>
                  )}
                </div>
                <div className="col-span-2 text-right text-xs text-ink-muted">
                  {request.certificateStatus}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
