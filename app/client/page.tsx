import AppShell from "@/components/AppShell";
import ClientDashboard from "@/components/client/ClientDashboard";
import { UserRole } from "@/lib/enums";
import { requireClient } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { requestInclude } from "@/lib/requestQueries";
import { toRequestView } from "@/lib/viewModels";

// Authenticated, database-backed page — always render per request (never
// statically prerendered at build time, where no database is configured).
export const dynamic = "force-dynamic";

export default async function ClientPage() {
  const user = await requireClient();
  const organizationId =
    user.organizationId ??
    (
      await prisma.organization.findFirstOrThrow({
        where: { name: "MapleBank Legal" },
        select: { id: true },
      })
    ).id;

  const organization = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { name: true },
  });

  const requests = await prisma.translationRequest.findMany({
    where: { organizationId },
    include: requestInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AppShell
      role={UserRole.CLIENT}
      userName={user.name ?? "Client User"}
      userEmail={user.email ?? ""}
      workspace={organization.name}
    >
      <ClientDashboard
        organizationName={organization.name}
        requests={requests.map(toRequestView)}
      />
    </AppShell>
  );
}
