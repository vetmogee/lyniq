import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Lyniq',
  description: 'Admin dashboard for Lyniq nail salon',
};

export default async function AdminDashboardPage() {
  const servicesCount = await prisma.service.count();

  return (
    <div className="p-6 md:p-8 bg-[#202020] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of your salon operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{servicesCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
