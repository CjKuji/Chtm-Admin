'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/app/context/SidebarContext';

interface SidebarProps {
  activeMenu?: string;
}

export default function Sidebar({ activeMenu = 'dashboard' }: SidebarProps) {
  const { collapsed, toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setMobileOpen(false);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'reservation', label: 'Reservation', icon: '📅' },
    { id: 'room', label: 'Room', icon: '🏠' },
    { id: 'tools', label: 'Tool Inventory', icon: '🔧' },
    { id: 'settings', label: 'System Settings', icon: '⚙' },
  ];

  const getHref = (id: string) => (id === 'dashboard' ? '/dashboard' : `/${id}`);

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={() => setMobileOpen(true)}
      className="fixed top-4 left-4 z-40 w-10 h-10 bg-teal-800 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-teal-700 transition-colors"
      aria-label="Open menu"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <MobileMenuButton />
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-teal-900 to-teal-800 text-white z-50 overflow-y-auto shadow-xl animate-slide-in">
              <div className="p-4 border-b border-teal-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">CHTM RRS</h1>
                    <p className="text-xs text-teal-200 font-medium tracking-wider">HOTEL MANAGEMENT</p>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 hover:bg-pink-400 rounded transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="py-4 px-2">
                <p className="text-xs font-semibold text-teal-300 uppercase px-2 mb-2 tracking-wider">Main</p>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.id}
                      href={getHref(item.id)}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeMenu === item.id
                          ? 'bg-pink-500 text-white font-semibold shadow-md'
                          : 'text-teal-100 hover:bg-pink-400 hover:text-white hover:font-medium'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="flex-1 text-sm antialiased">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-teal-950 border-t border-teal-700 p-3 text-xs text-teal-300 text-center">
                Version 2.0.0
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-teal-900 to-teal-800 text-white h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300 shadow-lg shadow-pink-200/30 antialiased z-30`}
    >
      <div className="p-4 border-b border-teal-700">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div>
              <h1 className="text-xl font-bold tracking-tight">CHTM RRS</h1>
              <p className="text-xs text-teal-200 font-medium tracking-wider">HOTEL MANAGEMENT</p>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <h1 className="text-xl font-bold tracking-tight">🏨</h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-teal-700 rounded transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            {collapsed ? '➡️' : '⬅️'}
          </button>
        </div>
      </div>

      <div className="py-4 px-2">
        <p className={`text-xs font-semibold text-teal-300 uppercase px-2 mb-2 tracking-wider ${collapsed ? 'hidden' : ''}`}>
          Main
        </p>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={getHref(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? 'bg-pink-500 text-white font-semibold shadow-md'
                  : 'text-teal-100 hover:bg-pink-400 hover:text-white hover:font-medium'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="flex-1 text-sm antialiased">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-teal-950 border-t border-teal-700 p-3 text-xs text-teal-300 ${collapsed ? 'text-center' : 'text-left'}`}>
        {collapsed ? 'v2.0' : 'Version 2.0.0'}
      </div>
    </aside>
  );
}