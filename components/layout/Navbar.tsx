'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Domů' },
  { href: '/services', label: 'Služby a ceník' },
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
        {/* Menu Button */}
        <div className="grid grid-cols-3 items-center px-4 py-2">
          <div className="animate-[slideDown_0.8s_ease-out]">
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
          </div>

          {/* Logo */}
          <div className="animate-[slideDown_0.8s_ease-out_0.1s_both]">
            <Link
              href="/"
              onClick={closeMenu}
            >
              <Logo
                width={30}
                height={20}
                className="h-20 w-50"
                priority
              />
            </Link>
          </div>

          {/* Rezervovat Button */}
          <div className="justify-self-end animate-[slideDown_0.8s_ease-out_0.2s_both]">
            <Link
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-sm font-medium px-4 py-2 rounded
                bg-gray-500 text-white
                hover:bg-[#636362] hover:pb-3 hover:scale-105 transition-all duration-300
              "
            >
              Rezervovat
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black opacity-30"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <aside
        className={`
          md:hidden fixed left-0 top-0 h-auto w-full z-50
          bg-[#141414]
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        {/* Logo in Menu */}
        <div 
          className={`
            p-6 grid justify-center
            transform transition-all duration-500 ease-out
            ${isMenuOpen 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
            }
          `}
        >
          <Link 
            href="/"
          >
            <Logo
              width={30}
              height={20}
              className="h-20 w-50"
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto justify-center">
          <ul className="space-y-1">
            {navLinks.map((link, index) => (
              <li 
                key={link.href}
                className={`
                  transform transition-all duration-600 ease-out
                  ${isMenuOpen 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-full opacity-0'
                  }
                `}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
                }}
              >
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={`
                    block w-2/3 mx-auto px-4 py-3 text-base font-medium transition-all duration-300 text-center
                    hover:pb-5 hover:scale-105
                    ${isActive(link.href)
                      ? 'text-white border-b-2 border-[#677075]'
                      : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-[#677075] focus:border-b-2 focus:border-[#677075]'
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
        <div 
          className={`
            py-4 px-6 mb-6
            transform transition-all duration-600 ease-out
            ${isMenuOpen 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
            }
          `}
          style={{
            transitionDelay: isMenuOpen ? `${navLinks.length * 100}ms` : '0ms'
          }}
        >
          <Link
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="
              block w-full text-center px-6 py-3 text-base font-medium
              bg-gray-500 text-white
              hover:bg-[#3a3f41] hover:pb-5 hover:scale-105 transition-all duration-300 rounded
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
      <div className="p-6 pl-8 animate-[slideDown_0.8s_ease-out]">
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
      <div className="px-6 pl-8 pb-4 animate-[slideDown_0.8s_ease-out_0.2s_both]">
        <Link
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block w-full text-center px-6 py-3 text-base font-medium
            bg-gray-500 text-white
            hover:bg-[#3a3f41] hover:pb-5 hover:scale-105 transition-all duration-300
            
          "
        >
          Rezervovat
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navLinks.map((link, index) => (
            <li key={link.href} className="animate-[slideDown_0.8s_ease-out_both]" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <Link
                href={link.href}
                className={`
                  flex items-center justify-center px-4 py-3 text-md font-medium transition-all duration-300 text-center
                  hover:pb-5 hover:scale-105
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
