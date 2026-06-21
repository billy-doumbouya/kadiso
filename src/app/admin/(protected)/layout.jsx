import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminProtectedLayout({ children }) {
  const session = await getAdminSession();

  return (
    <div className="flex min-h-screen bg-paper-deep">
      <AdminSidebar adminName={session?.name || session?.email || "Administrateur"} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</main>
    </div>
  );
}
