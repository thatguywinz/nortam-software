"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Building2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

type LoginInput = z.infer<typeof loginSchema>;

const demoAccounts = [
  {
    label: "Client Portal",
    email: "client@nortamdemo.com",
    password: "DemoClient123!",
    workspace: "MapleBank Legal",
    icon: Building2,
  },
  {
    label: "Employee Workspace",
    email: "employee@nortamdemo.com",
    password: "DemoEmployee123!",
    workspace: "Nortam Review Operations",
    icon: Users,
  },
];

export default function LoginForm() {
  const [authError, setAuthError] = useState("");
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "client@nortamdemo.com",
      password: "DemoClient123!",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError("");
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result?.ok) {
      setAuthError("Invalid email or password.");
      return;
    }

    // Resolve the role from the freshly-issued session and go straight to the
    // matching dashboard. A hard navigation guarantees the server renders the
    // dashboard with the new session cookie — avoiding the client-router race
    // that previously left users on a blank "/" or back on "/login".
    const session = await getSession();
    const destination =
      session?.user?.role === "CLIENT" ? "/client" : "/employee";
    window.location.assign(destination);
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-shell-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-shell-radial"
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NortamMark />
            <div>
              <div className="font-serif text-xl">
                Nortam <span className="text-brand-gold">Assure</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Translation trust platform
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 md:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
            Secure local MVP workspace
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
              <Sparkles className="h-3 w-3 text-brand-gold" />
              Human-verified AI translation
            </div>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
              AI speed. Human judgment.{" "}
              <span className="text-brand-gold">Certified trust.</span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white/66">
              Built for documents where a translation error can become a legal,
              financial, or reputational risk.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52">
              Nortam Assure routes work based on consequence, not just word
              count. Every AI output, human edit, approval, and timestamp is
              captured.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-floating backdrop-blur"
          >
            <div className="border-b border-white/10 px-6 py-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                Real authentication
              </div>
              <h2 className="mt-1 font-serif text-2xl text-white">
                Sign in to Nortam Assure
              </h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
              <Field label="Email">
                <input
                  type="email"
                  autoComplete="email"
                  {...form.register("email")}
                  className="auth-input"
                />
                {form.formState.errors.email && (
                  <ErrorText>{form.formState.errors.email.message}</ErrorText>
                )}
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  autoComplete="current-password"
                  {...form.register("password")}
                  className="auth-input"
                />
                {form.formState.errors.password && (
                  <ErrorText>{form.formState.errors.password.message}</ErrorText>
                )}
              </Field>

              {authError && (
                <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-shell-900 transition hover:bg-white/90 disabled:opacity-60"
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="grid gap-3 border-t border-white/10 bg-shell-900/40 p-5 md:grid-cols-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      form.setValue("email", account.email);
                      form.setValue("password", account.password);
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="h-4 w-4 text-brand-gold" />
                      {account.label}
                    </div>
                    <div className="mt-2 text-xs text-white/55">
                      {account.workspace}
                    </div>
                    <div className="mt-2 font-mono text-[11px] text-white/45">
                      {account.email}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>

      <style jsx>{`
        :global(.auth-input) {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          padding: 10px 11px;
          color: white;
          font-size: 14px;
        }
        :global(.auth-input:focus) {
          outline: none;
          border-color: rgba(37, 99, 235, 0.75);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="mt-1 text-xs text-red-200">{children}</div>;
}

function NortamMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
      <defs>
        <linearGradient id="nm-login" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#nm-login)" />
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
