import AdminLogin from '@/components/admin/AdminLogin';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Lyniq',
  description: 'Admin login for Lyniq nail salon',
};

export default function LoginPage() {
  return <AdminLogin />;
}
