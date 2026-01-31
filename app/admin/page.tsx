import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';

export default async function AdminPage() {
  // If user is already authenticated, redirect to dashboard
  const user = await getUser();
  if (user) {
    redirect('/admin/dashboard');
  }

  return <AdminLogin />;
}
