"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileStack, Hourglass, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAssure } from "@/lib/store";
import MetricCard from "../MetricCard";
import CertificateModal from "../CertificateModal";
import ClientNewRequestForm from "./ClientNewRequestForm";
import ClientProjectStatus from "./ClientProjectStatus";
import ClientDocumentList from "./ClientDocumentList";
import ClientCertificates from "./ClientCertificates";

export default function ClientPortal() {
  const { newRequestFlash } = useAssure();
  const [certOpen, setCertOpen] = useState(false);

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                MapleBank Legal
              </div>
              <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink">
                MapleBank Legal Translation Portal
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
                Submit high-stakes translation requests, track expert review, and
                access certified outputs in one secure workspace.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              Confidential client workspace
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {newRequestFlash && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <div className="font-medium text-emerald-900">
                  Request received. AI first draft queued.
                </div>
                <div className="mt-0.5 text-emerald-700">
                  Risk scoring will determine the required human review path.
                  Track progress under Live Project Status.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            index={0}
            label="Active Requests"
            value={6}
            hint="Across 3 jurisdictions"
            accent="blue"
            icon={<FileStack className="h-4 w-4" />}
          />
          <MetricCard
            index={1}
            label="Pending Approvals"
            value={2}
            hint="Awaiting your sign-off"
            accent="amber"
            icon={<Hourglass className="h-4 w-4" />}
          />
          <MetricCard
            index={2}
            label="Certificates Issued"
            value={14}
            hint="Last 30 days"
            accent="gold"
            icon={<ShieldCheck className="h-4 w-4" />}
          />
          <MetricCard
            index={3}
            label="Avg Turnaround Saved"
            value={42}
            suffix="%"
            delta="+8% QoQ"
            hint="vs. traditional human-only review"
            accent="green"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ClientProjectStatus />
          </div>
          <div>
            <ClientNewRequestForm />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ClientDocumentList />
          </div>
          <div>
            <ClientCertificates onPreview={() => setCertOpen(true)} />
          </div>
        </section>
      </div>
      <CertificateModal open={certOpen} onClose={() => setCertOpen(false)} />
    </div>
  );
}
