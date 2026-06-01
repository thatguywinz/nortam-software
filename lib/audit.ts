import { prisma } from "@/lib/prisma";

export async function addAuditEvent(input: {
  requestId?: string | null;
  userId?: string | null;
  actor: string;
  action: string;
  status?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditEvent.create({
    data: {
      requestId: input.requestId ?? null,
      userId: input.userId ?? null,
      actor: input.actor,
      action: input.action,
      status: input.status ?? "complete",
      metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}
