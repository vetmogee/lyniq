import ConditionalLayout from '@/components/layout/ConditionalLayout';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConditionalLayout>{children}</ConditionalLayout>;
}
