import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ClientRequestDetail from "@/components/client/ClientRequestDetail";
import { UserRole } from "@/lib/enums";
import { assertCanViewRequest } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { requestInclude } from "@/lib/requestQueries";
import { toRequestView } from "@/lib/viewModels";

export default async function ClientRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await assertCanViewRequest(params.id);
  const request = await prisma.translationRequest.findUnique({
    where: { id: params.id },
    include: requestInclude,
  });

  if (!request) notFound();

  return (
    <AppShell
      role={UserRole.CLIENT}
      userName={user.name ?? "Client User"}
      userEmail={user.email ?? ""}
      workspace={request.organization.name}
    >
      <ClientRequestDetail request={toRequestView(request)} />
    </AppShell>
  );
}
