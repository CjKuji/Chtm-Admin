"use client";

import React, { useState, useEffect } from "react";
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import { supabase } from '@/lib/supabase';

interface ReservationItem {
  id: number;
  guest: string;
  date: string;
  time: string;
}

interface CheckInItem {
  id: number;
  guest: string;
  date: string;
  time: string;
  isEarly?: boolean;
}

interface CheckOutItem {
  id: number;
  guest: string;
  date: string;
  time: string;
  isEarly?: boolean;
}

interface RoomItem {
  id: number;
  room_number: string;
  cleanUp?: string;
}

export default function ReservationManagement() {
  const [activeTab, setActiveTab] = useState('reservations');

  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInItem[]>([]);
  const [checkOuts, setCheckOuts] = useState<CheckOutItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [reservedDates, setReservedDates] = useState<number[]>([]);

  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const monthName = 'March 2026';
  const daysInMonth = 31;

  // Tabs
  const tabs = [
    { id: 'reservations', label: 'Reservations' },
    { id: 'checkins', label: 'Check-Ins' },
    { id: 'checkouts', label: 'Check-outs' },
    { id: 'rooms', label: 'Room Management' },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchReservations();
    fetchRooms();
  }, []);

  // ---------------------
  // Fetch Reservations
  // ---------------------
  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_at,
          end_at,
          status,
          user_id,
          room_id,
          users!bookings_user_id_fkey(fname, lname),
          rooms!bookings_room_id_fkey(room_number)
        `);

      if (error) throw error;

      const pending: ReservationItem[] = [];
      const checkin: CheckInItem[] = [];
      const checkout: CheckOutItem[] = [];

      bookingsData?.forEach((b: any) => {
        const guestName = b.users ? `${b.users.fname} ${b.users.lname}` : 'Unknown';
        const roomNumber = b.rooms?.room_number || 'Unknown';
        const startDate = new Date(b.start_at);
        const endDate = new Date(b.end_at);

        const dateStr = startDate.toLocaleDateString();
        const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endDateStr = endDate.toLocaleDateString();
        const endTimeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        switch (b.status) {
          case 'pending':
            pending.push({ id: b.id, guest: guestName, date: dateStr, time: timeStr });
            break;
          case 'checked_in':
            checkin.push({ id: b.id, guest: guestName, date: dateStr, time: timeStr, isEarly: false });
            break;
          case 'checked_out':
            checkout.push({ id: b.id, guest: roomNumber, date: endDateStr, time: endTimeStr, isEarly: false });
            break;
        }
      });

      setReservations(pending);
      setCheckIns(checkin);
      setCheckOuts(checkout);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoadingReservations(false);
    }
  };

  // ---------------------
  // Fetch Rooms
  // ---------------------
  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('id, room_number');

      if (error) throw error;

      setRooms(roomsData);

      if (roomsData?.length > 0) {
        setSelectedRoom(roomsData[0]);
        fetchReservedDates(roomsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  // ---------------------
  // Fetch Reserved Dates for Calendar
  // ---------------------
  const fetchReservedDates = async (roomId: number) => {
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select('start_at, end_at')
        .eq('room_id', roomId)
        .in('status', ['pending', 'checked_in']);

      if (error) throw error;

      const dates: number[] = [];
      bookingsData?.forEach((b: any) => {
        const start = new Date(b.start_at);
        const end = new Date(b.end_at);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(d.getDate());
        }
      });
      setReservedDates(dates);
    } catch (error) {
      console.error('Error fetching reserved dates:', error);
    }
  };

  // ---------------------
  // Actions
  // ---------------------
  const handleAccept = async (id: number) => {
    await supabase.from('bookings').update({ status: 'checked_in' }).eq('id', id);
    await supabase.from('booking_logs').insert({ booking_id: id, action: 'Accepted', performed_by: supabase.auth.getUser()?.id });
    fetchReservations();
  };

  const handleDecline = async (id: number) => {
    await supabase.from('bookings').update({ status: 'declined' }).eq('id', id);
    await supabase.from('booking_logs').insert({ booking_id: id, action: 'Declined', performed_by: supabase.auth.getUser()?.id });
    fetchReservations();
  };

  const handleEarlyCheckIn = async (id: number) => {
    await supabase.from('booking_logs').insert({ booking_id: id, action: 'Early Check-in', performed_by: supabase.auth.getUser()?.id });
    setCheckIns(prev => prev.map(item => item.id === id ? { ...item, isEarly: true } : item));
  };

  const handleEarlyCheckOut = async (id: number) => {
    await supabase.from('booking_logs').insert({ booking_id: id, action: 'Early Check-out', performed_by: supabase.auth.getUser()?.id });
    setCheckOuts(prev => prev.map(item => item.id === id ? { ...item, isEarly: true } : item));
  };

  // ---------------------
  // Room Change
  // ---------------------
  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomNumber = e.target.value;
    const room = rooms.find(r => r.room_number === roomNumber);
    if (room) {
      setSelectedRoom(room);
      fetchReservedDates(room.id);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="reservation" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Reservation Management</h1>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => (
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
              {/* Reservations Tab */}
              {activeTab === 'reservations' && (
                <div className="overflow-x-auto">
                  {loadingReservations ? <p>Loading reservations...</p> : (
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
                        {reservations.map(item => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-800">{item.guest}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{item.time}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleAccept(item.id)} className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600">Accept</button>
                                <button onClick={() => handleDecline(item.id)} className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600">Decline</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Check-Ins Tab */}
              {activeTab === 'checkins' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Guest</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkIns.map(item => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">{item.guest}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.time}</td>
                          <td className="py-3 px-4">
                            {item.isEarly ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Early Check-in</span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Regular</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {!item.isEarly && (
                              <button onClick={() => handleEarlyCheckIn(item.id)} className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded hover:bg-purple-600">Early Check-in</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Check-Outs Tab */}
              {activeTab === 'checkouts' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkOuts.map(item => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">{item.guest}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{item.time}</td>
                          <td className="py-3 px-4">
                            {item.isEarly ? (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Early Check-out</span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Regular</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {!item.isEarly && (
                              <button onClick={() => handleEarlyCheckOut(item.id)} className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded hover:bg-orange-600">Early Check-out</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Room Management Tab */}
              {activeTab === 'rooms' && (
                <div className="overflow-x-auto">
                  {loadingRooms ? <p>Loading rooms...</p> : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Room</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Clean-up Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map(item => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-800">{item.room_number}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">8AM-10PM</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Room Availability */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Room Availability</h2>
            <div className="mb-4 flex items-center gap-4">
              <label htmlFor="room-select" className="text-sm font-medium text-gray-700">Select Room:</label>
              <select
                id="room-select"
                value={selectedRoom?.room_number || ''}
                onChange={handleRoomChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.room_number}>Room {r.room_number}</option>
                ))}
              </select>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{monthName} – Room {selectedRoom?.room_number}</h3>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                  <div key={day} className="text-xs font-semibold text-gray-600 py-2">{day}</div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const isReserved = reservedDates.includes(day);
                  return (
                    <div key={day} className={`p-3 rounded-lg text-sm font-medium ${isReserved ? 'bg-pink-500 text-white' : 'bg-green-100 text-green-800'}`}>{day}</div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-100 rounded"></span> Available
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-pink-500 rounded"></span> Reserved
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}