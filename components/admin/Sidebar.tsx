'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const prevPathnameRef = useRef(pathname);

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/services', label: 'Services', icon: '💅' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin');
    router.refresh();
  };

  // Close menu when route changes
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isOpen) {
      // Defer state update to avoid synchronous setState
      const timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 0);
      prevPathnameRef.current = pathname;
      return () => clearTimeout(timeoutId);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.admin-sidebar') && !target.closest('.admin-menu-button')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="admin-menu-button fixed top-4 left-4 z-50 lg:hidden bg-[#202020] text-white p-2 border-2 border-[#636362]"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
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

      {/* Sidebar */}
      <aside
        className={`
          admin-sidebar
          fixed top-0 left-0 h-full w-64 bg-[#202020] border-r-2 border-[#636362] z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex justify-center items-center pt-4">
            <Link href="/">
              <Image 
                src="/lyniq.svg" 
                alt="Logo" 
                width={300} 
                height={300} 
                className="h-30 w-50" 
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium transition-colors
                      ${
                        isActive(item.href)
                          ? 'text-white bg-[#636362] bg-opacity-20 border-l-2 border-[#636362]'
                          : 'text-gray-400 hover:text-white hover:bg-[#636362] hover:bg-opacity-10'
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t-2 border-[#636362]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#636362] hover:bg-opacity-10 transition-colors"
            >
              <span className="mr-3">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
