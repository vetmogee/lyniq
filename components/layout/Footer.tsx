'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link as LocaleLink } from '@/i18n/navigation';
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
  const t = useTranslations('Footer');

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
            <p className="text-base lg:text-lg text-gray-400">
              {t('tagline')}
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg lg:text-xl font-semibold text-white mb-4">{t('quickLinks')}</h4>
              <ul className="space-y-2">
                <li>
                  <LocaleLink href="/services" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                    {t('services')}
                  </LocaleLink>
                </li>
                <li>
                  <LocaleLink href="/gallery" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                    {t('gallery')}
                  </LocaleLink>
                </li>
                <li>
                  <LocaleLink href="/contact" className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors">
                    {t('contact')}
                  </LocaleLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg lg:text-xl font-semibold text-white mb-4">{t('contact')}</h4>
              <ul className="space-y-2 text-base lg:text-lg text-gray-400">
                <a href="https://maps.app.goo.gl/LjDxHHrtcxPfdSgX7" target="_blank" rel="noopener noreferrer" className="group">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                    <span className="text-gray-400 group-hover:text-white transition-colors">Želenická 1627/25</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 lg:w-[18px] lg:h-[18px] opacity-0" />
                    <span className="text-gray-400 group-hover:text-white transition-colors">405 02 Děčín 2-Letná</span>
                  </li>
                </a>
                <li className="flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                  <Link 
                    href="tel:+420775995611"
                    className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors"
                  >
                    +420 775 995 611
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                  <Link 
                    href="https://www.instagram.com/lyniqstudio/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors"
                  >
                    lyniqstudio
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                  <Link 
                    href="https://www.facebook.com/profile.php?id=61576728607438" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base lg:text-lg text-gray-400 hover:text-white transition-colors"
                  >
                    LYNIQ studio
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-[#636362]">
          <p className="text-base lg:text-lg text-gray-400 text-center">
            {t('rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
