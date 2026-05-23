"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  Gauge,
  Languages,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import { useAssure } from "@/lib/store";
import MetricCard from "../MetricCard";
import CertificateModal from "../CertificateModal";
import TrustCertificateCard from "../TrustCertificateCard";
import LiveTranslationQueue from "./LiveTranslationQueue";
import EmployeeDocumentInspector from "./EmployeeDocumentInspector";
import RiskIntelligenceCard from "./RiskIntelligenceCard";
import ReviewWorkspace from "./ReviewWorkspace";
import TerminologyGuardrails from "./TerminologyGuardrails";
import AuditTrail from "./AuditTrail";
import ClientPortalPreview from "./ClientPortalPreview";
import MediaExpansionCard from "./MediaExpansionCard";
import WorkflowPipeline from "../WorkflowPipeline";
import type { PipelineStage } from "@/lib/types";

const ORDER: PipelineStage[] = [
  "Submitted",
  "AI Draft",
  "Risk Scored",
  "Human Review",
  "Compliance Check",
  "Client Approval",
  "Trust Certificate",
];

export default function EmployeeWorkspace() {
  const { selectedDocument, generateCertificate } = useAssure();
  const [certOpen, setCertOpen] = useState(false);
  const reviewRef = useRef<HTMLDivElement | null>(null);
  const auditRef = useRef<HTMLDivElement | null>(null);

  const internalSteps = ORDER.map((label) => ({
    label,
    state: selectedDocument.pipeline[label],
    detail:
      label === "Risk Scored"
        ? selectedDocument.risk === "High"
          ? "High risk flagged"
          : selectedDocument.risk === "Medium"
            ? "Medium risk"
            : "Low risk"
        : undefined,
  }));

  const scrollTo = (target: "review" | "audit") => {
    const el = target === "review" ? reviewRef.current : auditRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-end justify-between gap-3"
        >
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              Nortam Review Operations
            </div>
            <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink">
              Nortam Assure Command Center
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
              AI-assisted translation, human-verified review, and certified
              auditability for high-stakes localization.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
            <ShieldAlert className="h-3 w-3" />
            11 high-risk in queue
          </div>
        </motion.div>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <MetricCard
            index={0}
            label="Faster Turnaround"
            value={42}
            suffix="%"
            hint="AI drafting + smart routing"
            accent="green"
            icon={<Gauge className="h-4 w-4" />}
          />
          <MetricCard
            index={1}
            label="Active Review Tasks"
            value={18}
            hint="Across 6 reviewers"
            accent="blue"
            icon={<ClipboardList className="h-4 w-4" />}
          />
          <MetricCard
            index={2}
            label="Terminology Consistency"
            value={96.8}
            suffix="%"
            hint="Client glossary match"
            accent="ink"
            icon={<Languages className="h-4 w-4" />}
          />
          <MetricCard
            index={3}
            label="Trust Certificates Issued"
            value={7}
            hint="Past 7 days"
            accent="gold"
            icon={<ShieldCheck className="h-4 w-4" />}
          />
          <MetricCard
            index={4}
            label="High-Risk in Queue"
            value={11}
            hint="Routed to certified experts"
            accent="red"
            icon={<ShieldAlert className="h-4 w-4" />}
          />
        </section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Internal Workflow Pipeline
              </div>
              <h2 className="mt-0.5 font-serif text-lg text-ink">
                {selectedDocument.title}
              </h2>
              <div className="mt-1 text-xs text-ink-muted">
                Client Request → AI First Draft → Risk Intelligence → Human
                Review → Terminology Check → Compliance Approval → Nortam Trust
                Certificate
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-2.5 py-1 text-[11px] font-medium text-brand-blue">
              Centerpiece view
            </div>
          </div>
          <div className="px-5 py-6">
            <WorkflowPipeline steps={internalSteps} />
          </div>
        </motion.section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <LiveTranslationQueue />
          </div>
          <div className="xl:col-span-2">
            <EmployeeDocumentInspector
              onOpenReview={() => scrollTo("review")}
              onViewAudit={() => scrollTo("audit")}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div ref={reviewRef}>
              <ReviewWorkspace />
            </div>
          </div>
          <div className="space-y-6">
            <RiskIntelligenceCard />
            <ClientPortalPreview />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TerminologyGuardrails />
          </div>
          <div>
            <MediaExpansionCard />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3" ref={auditRef}>
            <AuditTrail />
          </div>
          <div className="xl:col-span-2">
            <TrustCertificateCard
              onPreview={() => setCertOpen(true)}
              onGenerate={() => {
                generateCertificate();
                setTimeout(() => setCertOpen(true), 300);
              }}
            />
          </div>
        </section>
      </div>

      <CertificateModal open={certOpen} onClose={() => setCertOpen(false)} />
    </div>
  );
}
