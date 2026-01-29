'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide Navbar/Footer for admin routes (admin layout has its own sidebar)
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow md:ml-64">{children}</main>
      <Footer />
    </>
  );
}
