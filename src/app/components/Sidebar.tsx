'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  activeMenu?: string;
}

export default function Sidebar({ activeMenu = 'dashboard' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'reservation', label: 'Reservation', icon: '📅' },
    { id: 'room', label: 'Room', icon: '🏠' },
    { id: 'tools', label: 'Tool Inventory', icon: '🔧' },
  ];

  const systemItems = [
    { id: 'settings', label: 'System Settings', icon: '⚙' },
  ];

  const getHref = (id: string) => {
    return id === 'dashboard' ? '/dashboard' : `/${id}`;
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-teal-900 to-teal-800 text-white h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300 shadow-lg shadow-pink-200/30 antialiased`}
    >
      <div className="p-4 border-b border-teal-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold tracking-tight">CHTM RRS</h1>
              <p className="text-xs text-teal-200 font-medium tracking-wider">HOTEL MANAGEMENT</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-pink-400 rounded transition-colors duration-200"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      <div className="py-4 px-2">
        <p
          className={`text-xs font-semibold text-teal-300 uppercase px-2 mb-2 tracking-wider ${
            collapsed ? 'hidden' : ''
          }`}
        >
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
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && (
                <span className="flex-1 text-sm antialiased">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="py-4 px-2 border-t border-teal-700 mt-4">
        <p
          className={`text-xs font-semibold text-teal-300 uppercase px-2 mb-2 tracking-wider ${
            collapsed ? 'hidden' : ''
          }`}
        >
          System
        </p>
        <nav className="space-y-2">
          {systemItems.map((item) => (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? 'bg-pink-500 text-white font-semibold shadow-md'
                  : 'text-teal-100 hover:bg-pink-400 hover:text-white hover:font-medium'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && (
                <span className="flex-1 text-sm antialiased">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-teal-950 border-t border-teal-700 p-3 ${
          collapsed ? 'text-center' : ''
        }`}
      />
    </aside>
  );
}