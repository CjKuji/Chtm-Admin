'use client';

import { useEffect, useState } from 'react';
import ProfileCard from './ProfileCard';
import { useSidebar } from '@/app/context/SidebarContext';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'reservation' | 'lowstock' | 'outofstock' | 'checkin' | 'checkout' | 'archive' | 'system';
  read: boolean;
  link?: string;
}

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { collapsed } = useSidebar();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'lowstock':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'outofstock':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        );
      case 'checkin':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'checkout':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'archive':
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.999 2.999 0 0018 14.998V11c0-1.657-.895-3.095-2.236-3.884M15 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9v1a3 3 0 11-6 0v-1" />
            </svg>
          </div>
        );
    }
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notifications-container') && !target.closest('.mobile-menu-container')) {
        setShowNotifications(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`fixed top-0 right-0 z-20 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ${
      isMobile 
        ? 'left-0' // Full width on mobile
        : collapsed 
          ? 'left-20' // When sidebar collapsed on desktop
          : 'left-64' // When sidebar expanded on desktop
    }`}>
      <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* Left section - Logo and Title with proper spacing for mobile menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo - Always visible, with left padding on mobile when menu is closed */}
          <div className={`flex items-center gap-2 ${isMobile ? 'ml-10' : 'ml-0'}`}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0" 
            />
            <div className="truncate">
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-teal-800 truncate">
                {isMobile ? 'CHTM-RRS' : '𝖠𝖣𝖬𝖨𝖭 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣'}
              </h2>
              <p className="text-xs sm:text-sm text-teal-600 truncate hidden sm:block">
                {isMobile ? '' : '𝖢𝖧𝖳𝖬-𝖱𝖱𝖲 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣'}
              </p>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative notifications-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 sm:p-2 hover:bg-pink-50 rounded-lg transition relative"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.999 2.999 0 0018 14.998V11c0-1.657-.895-3.095-2.236-3.884M15 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9v1a3 3 0 11-6 0v-1"
                />
              </svg>
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`
                absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50
                ${isMobile 
                  ? 'fixed top-14 left-4 right-4 w-auto max-w-none' 
                  : 'w-80 sm:w-96'
                }
              `}>
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-pink-600 hover:text-pink-800 font-medium whitespace-nowrap"
                        >
                          {isMobile ? 'Mark all' : 'Mark all as read'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => {
                      const isNew = !n.read;
                      return (
                        <div
                          key={n.id}
                          className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                            isNew ? 'bg-pink-50/30' : ''
                          }`}
                        >
                          <div className="flex gap-2 sm:gap-3">
                            {getNotificationIcon(n.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1 sm:gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                    {n.message}
                                  </p>
                                </div>
                                {isNew && (
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 mt-2 flex-wrap">
                                <span className="text-xs text-gray-400">{n.time}</span>
                                {n.link && (
                                  <a
                                    href={n.link}
                                    className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {isMobile ? 'View' : 'View details'} →
                                  </a>
                                )}
                                {isNew && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      markAsRead(n.id);
                                    }}
                                    className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
                                  >
                                    Mark read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>

                <div className="p-2 sm:p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="pl-2 sm:pl-4 border-l border-gray-200">
            <ProfileCard />
          </div>
        </div>
      </div>
    </header>
  );
}