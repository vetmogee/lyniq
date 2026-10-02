import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow md:ml-64 mt-25 md:mt-0">{children}</main>
      <Footer />
    </div>
  );
}
