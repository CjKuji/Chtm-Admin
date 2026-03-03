"use client";

import { useState } from "react";
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function ReservationManagement() {
  const [activeTab, setActiveTab] = useState('reservations');

  // Sample data for tables
  const reservations = [
    { id: 1, guest: 'Guest#5', date: '02-27-2026', time: '10:34 AM' },
    { id: 2, guest: 'Guest#6', date: '03-15-2026', time: '05:14 PM' },
  ];

  const checkIns = [
    { id: 1, guest: 'Guest#4', date: '02-10-2026', time: '11:34 AM' },
    { id: 2, guest: 'Guest#3', date: '02-09-2026', time: '05:14 AM' },
  ];

  const checkOuts = [
    { id: 1, guest: 'Room#1', date: '02-13-2026', time: '01:34 AM' },
    { id: 2, guest: 'Room#2', date: '02-09-2026', time: '03:14 AM' },
  ];

  const roomManagement = [
    { id: 1, room: '101', date: '02-15-2026', cleanUp: '8AM-10PM' },
    { id: 2, room: '102', date: '02-14-2026', cleanUp: '12PM-2PM' },
  ];

  // Mock data for availability
  const rooms = ['101', '102', '103', '201', '202'];
  const [selectedRoom, setSelectedRoom] = useState('101');

  // Generate mock reserved dates for the current month (March 2026 as example)
  const getReservedDates = (room: string) => {
    const baseReserved = [5, 6, 7, 12, 13, 18, 19, 25, 26];
    if (room === '101') return baseReserved;
    if (room === '102') return [2, 3, 8, 9, 10, 15, 16, 22, 23, 29];
    if (room === '103') return [1, 4, 11, 14, 20, 21, 27, 28];
    return [7, 8, 14, 15, 21, 22, 28, 29];
  };

  const reservedDates = getReservedDates(selectedRoom);

  // Days in March 2026 (31 days)
  const daysInMonth = 31;
  const monthName = 'March 2026';

  const tabs = [
    { id: 'reservations', label: 'Reservations' },
    { id: 'checkins', label: 'Check-Ins' },
    { id: 'checkouts', label: 'Check-outs' },
    { id: 'rooms', label: 'Room Management' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="reservation" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Reservation Management</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'reservations' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Guest</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">{item.guest}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.time}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600">
                                Accept
                              </button>
                              <button className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600">
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'checkins' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Guest</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkIns.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">{item.guest}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'checkouts' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkOuts.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">{item.guest}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'rooms' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Clean-up Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomManagement.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">{item.room}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.cleanUp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Room Availability Section (always visible below the main card) */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Room Availability</h2>
            <div className="mb-4 flex items-center gap-4">
              <label htmlFor="room-select" className="text-sm font-medium text-gray-700">
                Select Room:
              </label>
              <select
                id="room-select"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    Room {room}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{monthName} – Room {selectedRoom}</h3>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-xs font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const isReserved = reservedDates.includes(day);
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-lg text-sm font-medium ${
                        isReserved
                          ? 'bg-pink-500 text-white'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-100 rounded"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-pink-500 rounded"></span>
                  <span>Reserved</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * This is a demo. In production, connect to real reservation data.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}