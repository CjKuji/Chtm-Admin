'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cormorant, Inter } from 'next/font/google';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

const cormorant = Cormorant({ subsets: ['latin'], weight: ['300', '400', '600'] });
const inter = Inter({ subsets: ['latin'] });

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Aleczandergopez');
  const [userEmail, setUserEmail] = useState('aleczandergopez@gmail.com');
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(userName);
  const [formEmail, setFormEmail] = useState(userEmail);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedName) {
      setUserName(storedName);
      setFormName(storedName);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
      setFormEmail(storedEmail);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userName', formName);
    localStorage.setItem('userEmail', formEmail);
    setUserName(formName);
    setUserEmail(formEmail);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 font-sans antialiased ${inter.className}`}>
      <Sidebar activeMenu="" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className={`text-2xl font-bold text-gray-800 mb-6 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>
              My Profile
            </h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header with avatar - using login page dark green */}
              <div className="px-6 py-8 text-white" style={{ background: 'linear-gradient(135deg, #3D5A4C 0%, #2d4339 100%)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center font-bold text-3xl shadow-lg" style={{ color: '#3D5A4C' }}>
                    {getInitials(userName)}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${cormorant.className}`}>{userName}</h2>
                    <p className="text-sm opacity-90">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Profile details */}
              <div className="p-6">
                {!isEditing ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>
                          Full Name
                        </label>
                        <p className="text-lg text-gray-800">{userName}</p>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>
                          Email Address
                        </label>
                        <p className="text-lg text-gray-800">{userEmail}</p>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>
                          Role
                        </label>
                        <p className="text-lg text-gray-800">Super Admin</p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                        style={{ backgroundColor: '#3D5A4C' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d4339')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3D5A4C')}
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className={`block text-sm font-medium mb-1 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                          style={{ color: '#3D5A4C' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={`block text-sm font-medium mb-1 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                          style={{ color: '#3D5A4C' }}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                        style={{ backgroundColor: '#3D5A4C' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d4339')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3D5A4C')}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormName(userName);
                          setFormEmail(userEmail);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}