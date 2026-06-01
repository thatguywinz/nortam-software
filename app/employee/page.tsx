import { Inbox } from "lucide-react";
import AppShell from "@/components/AppShell";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";
import { requireEmployee } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { requestInclude } from "@/lib/requestQueries";
import { toRequestView } from "@/lib/viewModels";

export default async function EmployeePage() {
  const user = await requireEmployee();
  const requests = await prisma.translationRequest.findMany({
    include: requestInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  const views = requests.map(toRequestView);

  return (
    <AppShell
      role={user.role}
      userName={user.name ?? "Nortam Employee"}
      userEmail={user.email ?? ""}
      workspace="Nortam Review Operations"
    >
      {views.length === 0 ? (
        <div className="flex min-h-[60vh] items-center justify-center px-6 py-10">
          <div className="max-w-md rounded-2xl border border-border bg-panel-card p-8 text-center shadow-panel">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-brand-blue ring-1 ring-blue-200">
              <Inbox className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-serif text-2xl text-ink">
              Queue is empty
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              No translation requests have been submitted yet. As clients submit
              new work it will appear here for review.
            </p>
            <p className="mt-3 text-xs text-ink-muted">
              Run <span className="font-mono">npx prisma db seed</span> to load
              the demo workspace.
            </p>
          </div>
        </div>
      ) : (
        <EmployeeDashboard requests={views} selected={views[0]} />
      )}
    </AppShell>
  );
}
