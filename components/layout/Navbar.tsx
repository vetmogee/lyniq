'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Domů' },
  { href: '/services', label: 'Služby' },
  { href: '/employees', label: 'Tým' },
  { href: '/gallery', label: 'Galerie' },
  { href: '/contact', label: 'Kontakt' },
];

const bookingUrl = 'https://noona.app/cs/lyniqstudio/book';

// Logo Component
function Logo({ width, height, className, priority = false }: { width: number; height: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/lyniq.svg"
      alt="Lyniq Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}

// Mobile Navbar Component
function MobileNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show navbar at the top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (href: string) => {
    return pathname === href || pathname === `${href}/`;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Sticky Top Navbar */}
      <header
        className={`
          md:hidden fixed top-0 left-0 right-0 z-50
          bg-[#141414] border-b-0
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#677075] rounded"
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

          {/* Logo */}
          <Link
            href="/"
            className="flex-1 flex justify-center"
            onClick={closeMenu}
          >
            <Logo
              width={50}
              height={10}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Rezervovat Button */}
          <Link
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2 text-sm font-medium
              bg-[#3a3f41] text-white
              hover:bg-gray-800 transition-colors duration-200
            "
          >
            Rezervovat
          </Link>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[#141414] bg-opacity-60"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <aside
        className={`
          md:hidden fixed left-0 top-0 h-full w-72 z-50
          bg-[#141414]
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo in Menu */}
        <div className="p-6">
          <Link
            href="/"
            className="block hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <Logo
              width={20}
              height={20}
              className="h-20 w-20"
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={`
                    block px-4 py-3 text-base font-medium transition-colors rounded
                    ${isActive(link.href)
                      ? 'text-white bg-[#677075] bg-opacity-20'
                      : 'text-gray-400 hover:text-white hover:bg-[#677075] hover:bg-opacity-10'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rezervovat Button in Menu */}
        <div className="p-4 border-t border-[#677075]">
          <Link
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="
              block w-full text-center px-6 py-3 text-base font-medium
              bg-[#677075] text-white
              hover:bg-gray-800 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#677075] rounded
            "
          >
            Rezervovat
          </Link>
        </div>
      </aside>
    </>
  );
}

// Desktop Navbar Component
function DesktopNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname === `${href}/`;
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#141414] z-50 flex-col">
      {/* Logo */}
      <div className="p-6 pl-8">
        <Link 
          href="/" 
          className="block hover:opacity-80 transition-opacity"
        >
          <Logo
            width={120}
            height={60}
            className="h-auto w-auto"
            priority
          />
        </Link>
      </div>

      {/* Rezervovat Button */}
      <div className="px-6 pl-8 pb-4">
        <Link
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block w-full text-center px-6 py-3 text-base font-medium
            bg-[#677075] text-white
            hover:bg-gray-800 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#677075] focus:ring-offset-2 focus:ring-offset-black
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
                className={`
                  flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors text-center
                  ${isActive(link.href)
                    ? 'text-white border-b-2 border-[#677075]'
                    : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-[#677075]'
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
  );
}

// Main Navbar Component
export default function Navbar() {
  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  );
}
