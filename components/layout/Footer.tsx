import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-[#b0aeab] bg-black z-10 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/Lyniq.svg"
                alt="Lyniq Beauty Studio"
                width={120}
                height={60}
                className="h-auto w-auto"
              />
            </div>
            <p className="text-sm text-gray-400">
              Profesionální péče o nehty s moderním, ostrým estetickým designem.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Služby
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Salon Street</li>
              <li>City, State 12345</li>
              <li>Telefon: (555) 123-4567</li>
              <li>E-mail: info@lyniqbeautystudio.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-[#b0aeab]">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Lyniq Beauty Studio. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
