import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-gray-900 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">NAIL SALON</h3>
            <p className="text-sm text-gray-400">
              Professional nail care services with a modern, sharp aesthetic.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Salon Street</li>
              <li>City, State 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@nailsalon.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-gray-900">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Nail Salon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
