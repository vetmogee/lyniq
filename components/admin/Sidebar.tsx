'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    router.push('/admin/login');
    router.refresh();
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
      {/* Fixed Top Navbar - Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-gray-900 h-16 flex items-center justify-between px-4">
        <Link 
          href="/" 
          className="text-xl font-bold text-white hover:text-gray-400 transition-colors"
        >
          NAIL SALON
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="admin-menu-button p-2 text-white hover:bg-gray-900 transition-colors"
          aria-label="Toggle admin menu"
          aria-expanded={isOpen}
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
      </div>

      {/* Fixed Top Navbar - Desktop */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-gray-900 h-16 items-center justify-between px-6">
        <Link 
          href="/" 
          className="text-xl font-bold text-white hover:text-gray-400 transition-colors"
        >
          NAIL SALON
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${isActive(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </div>


      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Only */}
      <aside
        className={`
          admin-sidebar lg:hidden fixed right-0 z-40
          w-64 border-l-2 border-gray-900 bg-black flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 top-16' : 'translate-x-full top-0'}
          h-[calc(100vh-4rem)]
        `}
      >
        <div className="p-6 border-b-2 border-gray-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">ADMIN PANEL</h2>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
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
        </div>
        
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                    ${isActive(item.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t-2 border-gray-900">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
