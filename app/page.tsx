"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAssure } from "@/lib/store";
import LoginScreen from "@/components/LoginScreen";
import AppShell from "@/components/AppShell";

export default function Page() {
  const { role } = useAssure();

  return (
    <main className="relative min-h-screen overflow-hidden bg-shell-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-shell-radial"
      />
      <AnimatePresence mode="wait">
        {role === null ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <LoginScreen />
          </motion.div>
        ) : (
          <motion.div
            key={`shell-${role}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <AppShell />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
