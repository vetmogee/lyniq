import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Nail Salon",
  description: "Admin login page",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Route group layouts should not render html/body tags
  // The root layout handles that - this just wraps children
  return <>{children}</>;
}
