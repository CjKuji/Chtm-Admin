'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ProfileCardProps {
  onLogout?: () => void;
}

interface UserProfile {
  fname: string;
  lname: string;
  email: string;
  role: string;
}

export default function ProfileCard({ onLogout }: ProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      // Get user from Supabase Auth
      const { data: { user: sessionUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !sessionUser) return;

      // Get profile info from your "users" table
      const { data, error } = await supabase
        .from('users')
        .select('fname,lname,role')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        return;
      }

      if (!data) {
        console.warn('No user profile found in database.');
        return;
      }

      setUser({
        fname: data.fname,
        lname: data.lname,
        role: data.role,
        email: sessionUser.email || ''
      });
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    router.push('/');
  };

  const getInitials = () => {
    if (!user) return '';
    return `${user.fname[0]}${user.lname[0]}`.toUpperCase();
  };

  const renderAvatar = (sizeClass: string, textSizeClass?: string) => (
    <div
      className={`${sizeClass} bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold ${textSizeClass || ''}`}
    >
      {getInitials()}
    </div>
  );

  if (!user) return <div>Loading...</div>;

  if (isMinimized) {
    return (
      <button onClick={() => setIsMinimized(false)} title={`${user.fname} ${user.lname}`}>
        {renderAvatar('w-10 h-10', 'text-sm')}
      </button>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pink-50 transition">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{user.fname} {user.lname}</p>
          <p className="text-xs text-gray-600">{user.role}</p>
        </div>
        {renderAvatar('w-10 h-10', 'text-sm')}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Account</h3>
            <button
              onClick={() => { setIsMinimized(true); setIsOpen(false); }}
              title="Minimize"
              className="text-gray-400 hover:text-pink-600 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-3">
            {renderAvatar('w-12 h-12', 'text-lg')}
            <div>
              <p className="text-sm font-semibold text-gray-900">{user.fname} {user.lname}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-medium text-green-600">Verified</span>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => { router.push('/profile'); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-pink-50 flex items-center gap-3"
            >
              My Profile
            </button>
            <hr className="my-2" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-pink-50 flex items-center gap-3 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}