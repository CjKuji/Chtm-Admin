"use client";

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

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

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertEnabled, setLoginAlertEnabled] = useState(true);

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

  // ✅ Reusable toggle component
  const Toggle = ({
    enabled,
    onClick,
  }: {
    enabled: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative w-12 h-6 rounded-full transition ${
        enabled ? 'bg-teal-600' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute w-4 h-4 bg-white rounded-full top-1 transition ${
          enabled ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  );

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
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
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

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-4">
                {notifItems.map((item) => (
                  <div key={item.key} className="flex justify-between">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <Toggle
                      enabled={notifications[item.key]}
                      onClick={() => toggleNotification(item.key)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="p-6 flex justify-between">
                <span className="text-sm text-gray-700">Dark Mode</span>
                <Toggle
                  enabled={appearance.darkMode}
                  onClick={() => toggleAppearance('darkMode')}
                />
              </div>
            )}

            {/* Admin */}
            {activeTab === 'admin' && (
              <div className="p-6 space-y-6">
                <div className="flex justify-between">
                  <span>Two-Factor Authentication</span>
                  <Toggle
                    enabled={twoFactorEnabled}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  />
                </div>

                <div className="flex justify-between">
                  <span>Login Alerts</span>
                  <Toggle
                    enabled={loginAlertEnabled}
                    onClick={() => setLoginAlertEnabled(!loginAlertEnabled)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}