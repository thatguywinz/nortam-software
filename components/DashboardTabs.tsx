"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DashboardSection = {
  key: string;
  label: string;
  icon?: ReactNode;
  node: ReactNode;
};

export default function DashboardTabs({
  sections,
  defaultView,
  header,
}: {
  sections: DashboardSection[];
  defaultView: string;
  header?: ReactNode;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("view") ?? defaultView;
  const active =
    sections.find((section) => section.key === requested) ?? sections[0];

  const hrefFor = (key: string) => {
    const next = new URLSearchParams(Array.from(params.entries()));
    next.set("view", key);
    return `${pathname}?${next.toString()}`;
  };

  return (
    <div className="px-6 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {header}

        {/* Navigation lives in the left Sidebar on desktop. This in-page tab
            strip only appears on small screens, where the Sidebar is hidden —
            so there is exactly one navigation control per screen size. */}
        <div className="sticky top-16 z-20 -mx-6 mb-6 border-b border-border bg-panel/80 px-6 py-2 backdrop-blur lg:hidden">
          <div className="flex flex-wrap gap-1">
            {sections.map((section) => {
              const isActive = section.key === active.key;
              return (
                <Link
                  key={section.key}
                  href={hrefFor(section.key)}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    isActive
                      ? "bg-shell-900 text-white shadow-panel"
                      : "text-ink-muted hover:bg-white hover:text-ink"
                  )}
                >
                  {section.icon}
                  {section.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div key={active.key} className="animate-[fadeIn_0.25s_ease]">
          {active.node}
        </div>
      </div>
    </div>
  );
}
