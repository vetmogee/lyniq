import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Lyniq',
  description: 'Kontaktujte nás s jakýmikoli dotazy nebo dotazy',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
