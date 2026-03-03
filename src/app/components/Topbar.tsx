'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProfileCard from './ProfileCard';

export default function Topbar() {
  const [userProfile, setUserProfile] = useState<{ fname: string; lname: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false); // flag for client-only render

  useEffect(() => {
    setMounted(true); // mark component as mounted (client-side)

    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        setUserProfile(JSON.parse(saved));
      }
    }

    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserProfile({ fname: 'Guest', lname: '', email: '' });
        localStorage.removeItem('userProfile');
        return;
      }

      // Fetch full profile from users table
      const { data: profile } = await supabase
        .from('users')
        .select('fname, lname')
        .eq('id', user.id)
        .single();

      const profileData = {
        fname: profile?.fname ?? user.email?.split('@')[0] ?? 'Admin',
        lname: profile?.lname ?? '',
        email: user.email ?? ''
      };

      setUserProfile(profileData);
      localStorage.setItem('userProfile', JSON.stringify(profileData));
    };

    fetchProfile();

    // Listen for logout
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        localStorage.removeItem('userProfile');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Only render after mounting to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm font-sans antialiased">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-2xl font-bold text-teal-800">𝖠𝖣𝖬𝖨𝖭 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣</h2>
            <p className="text-sm text-teal-600">𝖢𝖧𝖳𝖬-𝖱𝖱𝖲 𝖣𝖠𝖲𝖧𝖡𝖮𝖠𝖱𝖣</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-pink-50 rounded-lg transition relative">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.999 2.999 0 0018 14.998V11c0-1.657-.895-3.095-2.236-3.884M15 17H9m6 0v1a3 3 0 11-6 0v-1m6 0H9v1a3 3 0 11-6 0v-1" />
            </svg>
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="pl-4 border-l border-gray-200">
            <ProfileCard
              userName={
                userProfile
                  ? `${userProfile.fname} ${userProfile.lname}`
                  : 'Guest'
              }
              userEmail={userProfile?.email ?? ''}
            />
          </div>
        </div>
      </div>
    </header>
  );
}