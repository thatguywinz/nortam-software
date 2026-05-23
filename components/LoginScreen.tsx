"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAssure } from "@/lib/store";
import type { UserRole } from "@/lib/types";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35 + i * 0.12,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function NortamMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="nm-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#nm-g)" />
      <path
        d="M12 27V13l16 14V13"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function LoginScreen() {
  const { setRole } = useAssure();

  const choose = (role: UserRole) => setRole(role);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <NortamMark className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-serif text-xl tracking-tight">
              Nortam <span className="text-brand-gold">Assure</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">
              Canadian Translation Trust Platform
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 backdrop-blur md:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
          SOC 2 · ISO 27001 · Confidential workspace
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 flex max-w-3xl flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
          <Sparkles className="h-3 w-3 text-brand-gold" />
          High-stakes translation, certified
        </div>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-white md:text-6xl">
          AI speed. Human judgment.{" "}
          <span className="text-brand-gold">Certified trust.</span>
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-white/65">
          Built for documents where a translation error can become a legal,
          financial, or reputational risk.
        </p>
      </motion.div>

      <div className="mt-14 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        <motion.button
          type="button"
          onClick={() => choose("client")}
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-left backdrop-blur-sm"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-blue/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-brand-blue/15 p-2.5 ring-1 ring-brand-blue/30">
              <Building2 className="h-5 w-5 text-brand-blue" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              External
            </span>
          </div>
          <h2 className="mt-7 font-serif text-2xl text-white">Client Portal</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            For external clients submitting and tracking high-stakes
            translation requests.
          </p>
          <div className="mt-7 rounded-lg border border-white/10 bg-shell-900/50 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Demo workspace
            </div>
            <div className="mt-1 text-sm text-white/90">MapleBank Legal</div>
          </div>
          <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand-blue">
            Continue as Client
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => choose("employee")}
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-left backdrop-blur-sm"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-brand-gold/15 p-2.5 ring-1 ring-brand-gold/30">
              <Users className="h-5 w-5 text-brand-gold" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Internal
            </span>
          </div>
          <h2 className="mt-7 font-serif text-2xl text-white">
            Employee Workspace
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            For Nortam teams managing AI drafts, risk scoring, human review,
            compliance, audit trails, and certificates.
          </p>
          <div className="mt-7 rounded-lg border border-white/10 bg-shell-900/50 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Demo workspace
            </div>
            <div className="mt-1 text-sm text-white/90">
              Nortam Review Operations
            </div>
          </div>
          <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand-gold">
            Continue as Nortam Employee
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/45"
      >
        <span>© Nortam Assure</span>
        <span>Confidential client workspace</span>
        <span>Defensible audit trail</span>
        <span>Human-verified outputs</span>
      </motion.div>
    </div>
  );
}
