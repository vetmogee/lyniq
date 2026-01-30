'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsNavbarVisible(true);
      } 
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsNavbarVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: '/', label: 'Domů' },
    { href: '/services', label: 'Služby' },
    { href: '/employees', label: 'Tým' },
    { href: '/gallery', label: 'Galerie' },
    { href: '/contact', label: 'Kontakt' },
  ];

  const isActive = (href: string) => {
    // Check if pathname matches the href
    return pathname === href || pathname === `${href}/`;
  };

  return (
    <>
      {/* Mobile: Top Navbar with Grid */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-[#b0aeab] transition-transform duration-300 ease-in-out ${
        isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="grid grid-cols-3 items-center p-4">
          {/* Menu Button */}
          <div className="flex justify-start">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-[#b0aeab] p-2"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <Link 
              href="/"
              className="block hover:opacity-80 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              <Image
                src="/Lyniq.svg"
                alt="Lyniq Logo"
                width={50}
                height={10}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Empty space for grid alignment */}
          <div></div>
        </div>
      </div>

      {/* Mobile: Invisible overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sticky Left Sidebar - Desktop & Mobile */}
      <nav
        className={`
          fixed left-0 top-[73px] md:top-0 h-[calc(100dvh-73px)] md:h-full z-50
          bg-black
          ${isMenuOpen ? 'md:border-r-2 md:border-[#b0aeab]' : 'border-r-2 border-[#b0aeab]'}
          w-64 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="hidden md:block p-6 pl-8">
          <Link 
            href="/" 
            className="block hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/Lyniq.svg"
              alt="Lyniq Logo"
              width={120}
              height={60}
              className="h-auto w-auto"
              priority
            />
          </Link>
        </div>

        {/* Rezervovat Button */}
        <div className="hidden md:block px-6 pl-8 pb-4">
          <Link
            href="https://noona.app/cs/lyniqstudio/book"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className="
              block w-full text-center px-6 py-3 text-base font-medium
              bg-[#b0aeab] text-white
              hover:bg-gray-800 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#b0aeab] focus:ring-offset-2 focus:ring-offset-black
            "
          >
            Rezervovat
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors text-center
                    ${isActive(link.href)
                      ? 'text-white border-b-2 border-[#b0aeab]'
                      : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-[#b0aeab]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </nav>
    </>
  );
}
