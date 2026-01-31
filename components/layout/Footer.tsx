'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getImageDataUrl } from '@/lib/image-utils';

function Logo({ width, height, className }: { width: number; height: number; className?: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>('/lyniq.svg'); // Fallback to static file

  useEffect(() => {
    async function fetchLogo() {
      try {
        const response = await fetch('/api/logo');
        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            const dataUrl = getImageDataUrl(data.logo.data);
            if (dataUrl) {
              setLogoUrl(dataUrl);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Keep fallback logo
      }
    }

    fetchLogo();
  }, []);

  // Use img tag for data URLs (SVG from database)
  if (logoUrl && logoUrl.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt="Lyniq Beauty Studio"
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // Fallback to Next Image for static files
  return (
    <Image
      src={logoUrl || '/lyniq.svg'}
      alt="Lyniq Beauty Studio"
      width={width}
      height={height}
      className={className}
    />
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-[#b0aeab] bg-black z-10 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
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

        <div className="mt-8 pt-8 border-t-2 border-[#b0aeab]">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Lyniq Beauty Studio. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
