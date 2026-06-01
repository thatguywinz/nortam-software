import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";
import { requireEmployee } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { requestInclude } from "@/lib/requestQueries";
import { toRequestView } from "@/lib/viewModels";

export default async function EmployeeRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireEmployee();
  const [requests, selected] = await Promise.all([
    prisma.translationRequest.findMany({
      include: requestInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.translationRequest.findUnique({
      where: { id: params.id },
      include: requestInclude,
    }),
  ]);

  if (!selected) notFound();

  return (
    <AppShell
      role={user.role}
      userName={user.name ?? "Nortam Employee"}
      userEmail={user.email ?? ""}
      workspace="Nortam Review Operations"
    >
      <EmployeeDashboard
        requests={requests.map(toRequestView)}
        selected={toRequestView(selected)}
      />
    </AppShell>
  );
}
