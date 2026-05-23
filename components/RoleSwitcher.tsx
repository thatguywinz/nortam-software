"use client";

import { motion } from "framer-motion";
import { Building2, LogOut, Users } from "lucide-react";
import { useAssure } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function RoleSwitcher() {
  const { role, setRole } = useAssure();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center rounded-lg border border-border bg-white p-0.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => setRole("client")}
          className={cn(
            "relative z-10 flex items-center gap-1.5 rounded-md px-3 py-1.5 transition",
            role === "client" ? "text-white" : "text-ink-muted hover:text-ink"
          )}
        >
          {role === "client" && (
            <motion.span
              layoutId="role-switch"
              className="absolute inset-0 rounded-md bg-shell-900"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <Building2 className="relative h-3.5 w-3.5" />
          <span className="relative">Client</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("employee")}
          className={cn(
            "relative z-10 flex items-center gap-1.5 rounded-md px-3 py-1.5 transition",
            role === "employee" ? "text-white" : "text-ink-muted hover:text-ink"
          )}
        >
          {role === "employee" && (
            <motion.span
              layoutId="role-switch"
              className="absolute inset-0 rounded-md bg-shell-900"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <Users className="relative h-3.5 w-3.5" />
          <span className="relative">Employee</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => setRole(null)}
        className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-xs text-ink-muted hover:text-ink lg:flex"
        title="Return to login"
      >
        <LogOut className="h-3.5 w-3.5" />
        Exit
      </button>
    </div>
  );
}
