"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAssure } from "@/lib/store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ClientPortal from "./client/ClientPortal";
import EmployeeWorkspace from "./employee/EmployeeWorkspace";

export default function AppShell() {
  const { role } = useAssure();
  if (!role) return null;

  return (
    <div className="flex min-h-screen w-full text-ink">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-panel">
        <Topbar />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {role === "client" ? <ClientPortal /> : <EmployeeWorkspace />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
