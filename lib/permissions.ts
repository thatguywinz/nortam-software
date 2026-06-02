import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/enums";
import { authOptions } from "@/lib/auth";
import { ensureDatabaseReady } from "@/lib/bootstrap";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireSession() {
  // Guarantee the database is provisioned before any protected page queries.
  await ensureDatabaseReady();
  const user = await getSessionUser();
  if (!user?.id) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireSession();
  if (!roles.includes(user.role)) {
    redirect(user.role === UserRole.CLIENT ? "/client" : "/employee");
  }
  return user;
}

export async function requireEmployee() {
  return requireRole([UserRole.EMPLOYEE, UserRole.ADMIN]);
}

export async function requireClient() {
  return requireRole([UserRole.CLIENT, UserRole.ADMIN]);
}

export async function assertCanViewRequest(requestId: string) {
  const user = await requireSession();
  if (user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) {
    return user;
  }

  const request = await prisma.translationRequest.findUnique({
    where: { id: requestId },
    select: { organizationId: true },
  });

  if (!request || request.organizationId !== user.organizationId) {
    redirect("/client");
  }

  return user;
}

export async function ensureCanMutateClientRequest() {
  const user = await requireClient();
  if (user.role === UserRole.CLIENT && !user.organizationId) {
    throw new Error("Client user is not assigned to an organization.");
  }
  return user;
}

export function isEmployeeRole(role: UserRole) {
  return role === UserRole.EMPLOYEE || role === UserRole.ADMIN;
}
