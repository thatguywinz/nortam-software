"use client";

import { motion } from "framer-motion";
import { Film } from "lucide-react";
import { mediaExpansion } from "@/lib/mockData";

export default function MediaExpansionCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border bg-panel-card shadow-panel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            Roadmap
          </div>
          <h2 className="font-serif text-base text-ink">
            Expansion Path: Media Localization Assurance
          </h2>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/20">
          <Film className="h-4 w-4" />
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-1.5 px-5 py-4 sm:grid-cols-2">
        {mediaExpansion.map((m) => (
          <li
            key={m}
            className="flex items-center gap-2 rounded-lg border border-border bg-slate-50/50 px-3 py-2 text-sm text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
            {m}
          </li>
        ))}
      </ul>
      <div className="border-t border-border bg-slate-50/60 px-5 py-3 text-xs text-ink-muted">
        The same trust layer extends to subtitles, dubbing, and culturally
        adapted content for streaming and gaming clients.
      </div>
    </motion.section>
  );
}
