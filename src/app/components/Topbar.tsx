'use client';

import { useEffect, useState } from 'react';
import ProfileCard from './ProfileCard';

export default function Topbar() {
  const [userEmail, setUserEmail] = useState('aleczandergopez@gmail.com');
  const [userName, setUserName] = useState('Aleczandergopez');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    
    if (storedEmail) setUserEmail(storedEmail);
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm font-sans antialiased">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-2xl font-bold text-teal-800">
              𝖠𝖣𝖬𝖨𝖭 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣
            </h2>
            <p className="text-sm text-teal-600">
              𝖢𝖧𝖳𝖬-𝖱𝖱𝖲 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="p-2 hover:bg-pink-50 rounded-lg transition relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.999 2.999 0 0018 14.998V11c0-1.657-.895-3.095-2.236-3.884M15 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9v1a3 3 0 11-6 0v-1" />
            </svg>
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          {/* Profile Section with Divider */}
          <div className="pl-4 border-l border-gray-200">
            <ProfileCard userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </div>
    </header>
  );
}