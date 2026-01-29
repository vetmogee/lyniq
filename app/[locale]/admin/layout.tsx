import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-16 lg:pt-16">
        {children}
      </main>
    </div>
  );
}
