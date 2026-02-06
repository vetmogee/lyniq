'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MapPin, Phone } from 'lucide-react';

function Logo({ width, height, className }: { width: number; height: number; className?: string }) {
  return (
    <Image
      src="/lyniq.svg"
      alt="Lyniq Beauty Studio"
      width={width}
      height={height}
      className={className}
    />
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#202020] z-10 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo
                width={120}
                height={60}
                className="h-auto w-auto"
              />
            </div>
            <p className="text-sm text-gray-400">
              Profesionální péče o nehty s moderním, ostrým estetickým designem.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
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
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Želenická 1627/25/405 02</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 opacity-0" />
                  <span>405 02 Děčín 2-Letná</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <Link 
                    href="tel:+420775995611"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +420 775 995 611
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  <Link 
                    href="https://www.instagram.com/lyniqstudio/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    lyniqstudio
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  <Link 
                    href="https://www.facebook.com/profile.php?id=61576728607438" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    LYNIQ studio
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-[#636362]">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Lyniq Beauty Studio. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
