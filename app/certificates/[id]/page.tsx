import { notFound } from "next/navigation";
import { CertificateBody } from "@/components/CertificateViewer";
import PrintButton from "@/components/PrintButton";
import { UserRole } from "@/lib/enums";
import { addAuditEvent } from "@/lib/audit";
import { assertCanViewRequest } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { requestInclude } from "@/lib/requestQueries";
import { toRequestView } from "@/lib/viewModels";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await assertCanViewRequest(params.id);
  const request = await prisma.translationRequest.findUnique({
    where: { id: params.id },
    include: requestInclude,
  });

  if (!request?.certificate) notFound();

  if (user.role === UserRole.CLIENT) {
    await addAuditEvent({
      requestId: request.id,
      userId: user.id,
      actor: user.name ?? "Client",
      action: "Client viewed/downloaded certificate",
      metadata: { certificateCode: request.certificate.certificateCode },
    });
  }

  const view = toRequestView(request);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between print:hidden">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              Nortam Assure Certificate
            </div>
            <h1 className="font-serif text-2xl text-ink">{view.title}</h1>
          </div>
          <PrintButton />
        </div>
        <div className="overflow-hidden rounded-2xl border border-brand-gold/30 bg-white shadow-floating print:rounded-none print:border-0 print:shadow-none">
          <CertificateBody request={view} />
        </div>
      </div>
    </main>
  );
}
