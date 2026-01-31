// This layout applies to all admin routes
// Protected routes use their own layout in (protected) group
// Login route in (auth) group has no layout requirement
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
