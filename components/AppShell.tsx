import type { UserRole } from "@/lib/enums";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  role,
  userName,
  userEmail,
  workspace,
  children,
}: {
  role: UserRole;
  userName: string;
  userEmail: string;
  workspace: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full text-ink">
      <Sidebar role={role} workspace={workspace} />
      <div className="flex min-h-screen flex-1 flex-col bg-panel">
        <Topbar
          role={role}
          userName={userName}
          userEmail={userEmail}
          workspace={workspace}
        />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
