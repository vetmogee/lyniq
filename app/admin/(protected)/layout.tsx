import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authentication - will redirect to login if not authenticated
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">
        {children}
      </main>
    </div>
  );
}
