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
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
                text-sm font-medium px-4 py-2
                bg-gray-500 text-white
                hover:bg-[#636362] hover:scale-200 transition-all duration-300
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
        {/* Close Button and Logo in Menu */}
        <div 
          className={`
            grid grid-cols-3 items-center px-4 py-2
            transform transition-all duration-500 ease-out
            ${isMenuOpen 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
            }
          `}
        >
          {/* Close Button */}
          <div>
            <button
              onClick={closeMenu}
              className="text-white p-2 hover:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#677075]"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex justify-center items-center">
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
          
          {/* Empty space for grid balance */}
          <div></div>
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
                    block w-2/3 mx-auto px-4 py-3 font-medium transition-all duration-300 text-center
                    hover:pb-5 hover:scale-105
                    ${isActive(link.href)
                      ? 'text-white border-b-2 border-[#677075] text-lg'
                      : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-[#677075] focus:border-b-2 focus:border-[#677075] text-base'
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
            py-4 px-6
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
              hover:bg-[#3a3f41] hover:scale-105 transition-all duration-300
            "
          >
            Rezervovat
          </Link>
        </div>

        {/* Social Icons */}
        <div 
          className={`
            flex justify-center items-center gap-6 py-4 pb-6 border-t border-gray-700
            transform transition-all duration-600 ease-out
            ${isMenuOpen 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0'
            }
          `}
          style={{
            transitionDelay: isMenuOpen ? `${(navLinks.length + 1) * 100}ms` : '0ms'
          }}
        >
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </Link>
          <Link
            href="tel:+420123456789"
            onClick={closeMenu}
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Phone"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
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
            hover:bg-[#3a3f41] hover:scale-105 transition-all duration-300
            
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
                  flex items-center justify-center px-4 py-3 font-medium transition-all duration-300 text-center
                  hover:pb-5 hover:scale-105
                  ${isActive(link.href)
                    ? 'text-white border-b-2 border-[#677075] text-lg'
                    : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-[#677075] text-md'
                  }
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Icons */}
      <div className="flex justify-center items-center gap-6 py-6 border-t border-gray-700 animate-[slideDown_0.8s_ease-out_both]" style={{ animationDelay: `${0.4 + navLinks.length * 0.1}s` }}>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
          aria-label="Instagram"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </Link>
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
          aria-label="Facebook"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Link>
        <Link
          href="tel:+420123456789"
          className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
          aria-label="Phone"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        </Link>
      </div>
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
