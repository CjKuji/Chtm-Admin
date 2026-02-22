'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

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
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header with avatar - changed to pink gradient */}
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold text-3xl shadow-lg">
                    {getInitials(userName)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userName}</h2>
                    <p className="text-pink-100">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Profile details */}
              <div className="p-6">
                {!isEditing ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Full Name</label>
                        <p className="mt-1 text-lg text-gray-800">{userName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Email Address</label>
                        <p className="mt-1 text-lg text-gray-800">{userEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Role</label>
                        <p className="mt-1 text-lg text-gray-800">Super Admin</p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-pink-50 transition"
                      >
                        Back
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormName(userName);
                          setFormEmail(userEmail);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-pink-50 transition"
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