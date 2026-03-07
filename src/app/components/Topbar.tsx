'use client';

import { useEffect, useState } from 'react';
import ProfileCard from './ProfileCard';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type:
    | 'reservation'
    | 'lowstock'
    | 'outofstock'
    | 'checkin'
    | 'checkout'
    | 'archive'
    | 'system';
  read: boolean;
  link?: string;
}

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  // <-- replace with your own notification source when ready
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
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            {/* …svg omitted for brevity; copy from NOSUPA if you like */}
          </div>
        );
      case 'lowstock':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            {/* … */}
          </div>
        );
      // add other cases as needed
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            {/* generic icon */}
          </div>
        );
    }
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* logo + title */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-2xl font-bold text-teal-800">𝖠𝖣𝖬𝖨𝖭 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣</h2>
            <p className="text-sm text-teal-600">𝖢𝖧𝖳𝖬-𝖱𝖱𝖲 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣</p>
          </div>
        </div>

        {/* right actions */}
        <div className="flex items-center gap-4">
          {/* notification bell */}
          <div className="relative notifications-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-pink-50 rounded-lg transition relative"
            >
              <svg
                className="w-6 h-6 text-gray-600"
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
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => {
                      const isNew = !n.read;
                      return (
                        <div
                          key={n.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                            isNew ? 'bg-pink-50/30' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            {getNotificationIcon(n.type)}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    {n.message}
                                  </p>
                                </div>
                                {isNew && (
                                  <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-gray-400">{n.time}</span>
                                {n.link && (
                                  <a
                                    href={n.link}
                                    className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    View details →
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
                                    Mark as read
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

                <div className="p-3 border-t border-gray-200 bg-gray-50">
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

          {/* profile card */}
          <div className="pl-4 border-l border-gray-200">
            <ProfileCard />
          </div>
        </div>
      </div>
    </header>
  );
}