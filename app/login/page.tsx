import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { UserRole } from "@/lib/enums";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === UserRole.CLIENT) redirect("/client");
  if (session?.user) redirect("/employee");

  return <LoginForm />;
}
