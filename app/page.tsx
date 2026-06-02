import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/enums";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (session.user.role === UserRole.CLIENT) redirect("/client");
  redirect("/employee");
}
