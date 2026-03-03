'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import StatCard from '@/app/components/StatCard';

export default function Dashboard() {
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(true);
  const [totalRooms, setTotalRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 🔐 Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const now = new Date().toISOString();

      // Fetch all dashboard data in parallel
      const [roomsRes, occupiedRes, upcomingRes] = await Promise.all([
        supabase.from('rooms').select('*', { count: 'exact', head: true }),
        supabase
          .from('bookings')
          .select(`id, start_at, end_at, users ( full_name ), rooms ( room_number )`)
          .lte('start_at', now)
          .gte('end_at', now)
          .eq('status', 'approved'),
        supabase
          .from('bookings')
          .select(`id, start_at, end_at, users ( full_name ), rooms ( room_number )`)
          .gt('start_at', now)
          .eq('status', 'approved')
          .order('start_at', { ascending: true })
          .limit(5)
      ]);

      setTotalRooms(roomsRes.count || 0);
      setOccupiedRooms(occupiedRes.data || []);
      setUpcomingBookings(upcomingRes.data || []);
      setLoadingData(false);
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="dashboard" />
      <main className="relative flex-1 ml-64 overflow-hidden">
        {/* Topbar now fetches and shows the user profile */}
        <Topbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Rooms"
              value={loadingData ? '...' : totalRooms.toString()}
              icon="🏠"
              color="blue"
            />
            <StatCard
              title="Occupied"
              value={loadingData ? '...' : occupiedRooms.length.toString()}
              icon="👤"
              color="pink"
            />
            <StatCard
              title="Available"
              value={loadingData ? '...' : (totalRooms - occupiedRooms.length).toString()}
              icon="✓"
              color="green"
            />
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Occupied Rooms */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-pink-600 px-6 py-3">
                <h2 className="text-lg font-semibold text-white">Currently Occupied</h2>
              </div>
              <div className="p-4">
                {loadingData ? (
                  <p>Loading occupied rooms...</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-600">
                        <th className="text-left py-2">Room</th>
                        <th className="text-left py-2">Guest</th>
                        <th className="text-left py-2">Check-in</th>
                        <th className="text-left py-2">Check-out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {occupiedRooms.map((booking: any) => (
                        <tr key={booking.id} className="border-b hover:bg-pink-50">
                          <td className="py-2">{booking.rooms?.room_number}</td>
                          <td className="py-2">{booking.users?.full_name}</td>
                          <td className="py-2">{new Date(booking.start_at).toLocaleDateString()}</td>
                          <td className="py-2">{new Date(booking.end_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="mt-4 text-right">
                  <Link href="/room" className="text-sm text-pink-600 hover:underline">View all rooms →</Link>
                </div>
              </div>
            </div>

            {/* Upcoming Reservations */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-teal-600 px-6 py-3">
                <h2 className="text-lg font-semibold text-white">Upcoming Reservations</h2>
              </div>
              <div className="p-4">
                {loadingData ? (
                  <p>Loading upcoming bookings...</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-600">
                        <th className="text-left py-2">Guest</th>
                        <th className="text-left py-2">Room</th>
                        <th className="text-left py-2">Check-in</th>
                        <th className="text-left py-2">Check-out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingBookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b hover:bg-teal-50">
                          <td className="py-2">{booking.users?.full_name}</td>
                          <td className="py-2">{booking.rooms?.room_number}</td>
                          <td className="py-2">{new Date(booking.start_at).toLocaleDateString()}</td>
                          <td className="py-2">{new Date(booking.end_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="mt-4 text-right">
                  <Link href="/reservation" className="text-sm text-teal-600 hover:underline">View all reservations →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}