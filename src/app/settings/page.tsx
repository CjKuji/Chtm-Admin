"use client";

import React, { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertEnabled, setLoginAlertEnabled] = useState(true);
  
  type NotificationKey = 'checkIns' | 'checkOuts' | 'reservations' | 'ratings';
  type AppearanceKey = 'darkMode';

  interface NotificationsState {
    checkIns: boolean;
    checkOuts: boolean;
    reservations: boolean;
    ratings: boolean;
  }

  interface AppearanceState {
    darkMode: boolean;
  }

  const [notifications, setNotifications] = useState<NotificationsState>({
    checkIns: true,
    checkOuts: true,
    reservations: true,
    ratings: true,
  });

  const [appearance, setAppearance] = useState<AppearanceState>({
    darkMode: true,
  });
  
  const tabs = [
    { id: 'admin', label: 'Admin Settings', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  const toggleNotification = (key: NotificationKey) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAppearance = (key: AppearanceKey) => {
    setAppearance((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notifItems: { key: NotificationKey; label: string }[] = [
    { key: 'checkIns', label: 'Check-Ins' },
    { key: 'checkOuts', label: 'Check-outs' },
    { key: 'reservations', label: 'Reservations' },
    { key: 'ratings', label: 'Ratings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="settings" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
              Save Changes
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'border-b-2 border-pink-600 text-pink-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notification</h3>
                  <p className="text-sm text-gray-600">Control notifications that admin receives</p>
                </div>
                <div className="space-y-4">
                  {notifItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">{item.label}</label>
                      <button
                        onClick={() => toggleNotification(item.key)}
                        className={`relative w-12 h-6 rounded-full transition ${
                          notifications[item.key] ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition ${
                          notifications[item.key] ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">System</h3>
                  <p className="text-sm text-gray-600">Changes the theme of the system</p>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Dark Mode</label>
                  <button
                    onClick={() => toggleAppearance('darkMode')}
                    className={`relative w-12 h-6 rounded-full transition ${
                      appearance.darkMode ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition ${
                      appearance.darkMode ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Keep your account secure with extra authentication and alerts.</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative w-12 h-6 rounded-full transition ${
                        twoFactorEnabled ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition ${
                        twoFactorEnabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Login Alert Notification</p>
                      <p className="text-xs text-gray-600">Get notified when your account is accessed from a new device</p>
                    </div>
                    <button
                      onClick={() => setLoginAlertEnabled(!loginAlertEnabled)}
                      className={`relative w-12 h-6 rounded-full transition ${
                        loginAlertEnabled ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition ${
                        loginAlertEnabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <hr className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Password Management</h3>
                  <p className="text-sm text-gray-600 mb-4">Update your password</p>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}