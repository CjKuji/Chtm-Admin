'use client';

import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import StatCard from '@/app/components/StatCard';

export default function Dashboard() {
  // Mock data for occupied rooms (could be fetched from API)
  const occupiedRooms = [
    { id: 1, roomNumber: '101', guest: 'jim', checkIn: '2026-02-20', checkOut: '2026-02-25' },
    { id: 2, roomNumber: '102', guest: 'nemo', checkIn: '2026-02-19', checkOut: '2026-02-23' },
  ];

  // Mock data for upcoming reservations
  const upcomingReservations = [
    { id: 1, guest: 'jon king', room: '105', checkIn: '2026-03-01', checkOut: '2026-03-05' },
    { id: 2, guest: 'Lisa Ray', room: '203', checkIn: '2026-03-02', checkOut: '2026-03-07' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="dashboard" />
      <main className="relative flex-1 ml-64 overflow-hidden">
        {/* Background image with 50% opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
          style={{ backgroundImage: "url('/lo')" }}
        />
        {/* Foreground content */}
        <div className="relative z-10">
          <Topbar />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Rooms"
                value="48"
                icon="🏠"
                color="blue"
              />
              <StatCard
                title="Occupied"
                value="31"
                icon="👤"
                color="pink"
              />
              <StatCard
                title="Available"
                value="17"
                icon="✓"
                color="green"
              />
            </div>

            {/* Two-column layout for occupied rooms and upcoming reservations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Occupied Rooms Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-pink-600 px-6 py-3">
                  <h2 className="text-lg font-semibold text-white">Occupied Rooms</h2>
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-600 font-medium">
                        <th className="text-left py-2">Room</th>
                        <th className="text-left py-2">Guest</th>
                        <th className="text-left py-2">Check-in</th>
                        <th className="text-left py-2">Check-out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {occupiedRooms.map((room) => (
                        <tr key={room.id} className="border-b border-gray-100 hover:bg-pink-50 transition">
                          <td className="py-2">
                            <Link href={`/room`} className="text-teal-600 hover:underline">
                              {room.roomNumber}
                            </Link>
                          </td>
                          <td className="py-2">{room.guest}</td>
                          <td className="py-2">{room.checkIn}</td>
                          <td className="py-2">{room.checkOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right">
                    <Link href="/room" className="text-sm text-pink-600 hover:underline">
                      View all rooms →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Upcoming Reservations Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-600 px-6 py-3">
                  <h2 className="text-lg font-semibold text-white">Upcoming Reservations</h2>
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-600 font-medium">
                        <th className="text-left py-2">Guest</th>
                        <th className="text-left py-2">Room</th>
                        <th className="text-left py-2">Check-in</th>
                        <th className="text-left py-2">Check-out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingReservations.map((res) => (
                        <tr key={res.id} className="border-b border-gray-100 hover:bg-pink-50 transition">
                          <td className="py-2">{res.guest}</td>
                          <td className="py-2">
                            <Link href={`/room`} className="text-teal-600 hover:underline">
                              {res.room}
                            </Link>
                          </td>
                          <td className="py-2">{res.checkIn}</td>
                          <td className="py-2">{res.checkOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right">
                    <Link href="/reservation" className="text-sm text-pink-600 hover:underline">
                      View all reservations →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}