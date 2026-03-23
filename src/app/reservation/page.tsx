"use client";

import React, { useState, useEffect } from "react";
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import { supabase } from '@/lib/supabase';
import { useSidebar } from '@/app/context/SidebarContext';

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
  status?: 'pending' | 'approved' | 'checked_in' | 'checked_out';
}

interface CheckOutItem {
  id: number;
  guest: string;
  date: string;
  time: string;
  isEarly?: boolean;
  status?: 'checked_in' | 'checked_out'; // add status
}

interface RoomItem {
  id: number;
  room_number: string;
  cleanUp?: string;
}

export default function ReservationManagement() {
  const { collapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('reservations');
  const [isMobile, setIsMobile] = useState(false);
  const [_isTablet, setIsTablet] = useState(false);

  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInItem[]>([]);
  const [checkOuts, setCheckOuts] = useState<CheckOutItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [reservedDates, setReservedDates] = useState<number[]>([]);

  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  const monthName = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Check screen size with multiple breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
        early_checkin,
        early_checkout,
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
      const startDate = new Date(b.start_at);
      const endDate = new Date(b.end_at);

      const startDateStr = startDate.toLocaleDateString();
      const startTimeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endDateStr = endDate.toLocaleDateString();
      const endTimeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

 switch (b.status) {
  case 'pending':
    // only in Reservations tab
    pending.push({ id: b.id, guest: guestName, date: startDateStr, time: startTimeStr });
    break;

  case 'approved':
    // moves to Check-In tab
    checkin.push({ id: b.id, guest: guestName, date: startDateStr, time: startTimeStr, isEarly: false, status: 'approved' });
    break;

  case 'checked_in':
    // stays in Check-In tab and also goes to Check-Out tab
    checkin.push({ id: b.id, guest: guestName, date: startDateStr, time: startTimeStr, isEarly: b.early_checkin, status: 'checked_in' });
    checkout.push({ id: b.id, guest: guestName, date: endDateStr, time: endTimeStr, isEarly: b.early_checkout ?? false, status: 'checked_in' });
    break;

  case 'checked_out':
    // only in Check-Out tab
    checkout.push({ id: b.id, guest: guestName, date: endDateStr, time: endTimeStr, isEarly: b.early_checkout, status: 'checked_out' });
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
// Fetch Reserved Dates for Calendar (revised)
// ---------------------
const fetchReservedDates = async (roomId: number) => {
  try {
    const { data: bookingsData, error } = await supabase
      .from('bookings')
      .select('start_at, end_at, status')
      .eq('room_id', roomId)
      .in('status', ['approved', 'checked_in']); // only block approved or checked-in

    if (error) throw error;

    const datesSet = new Set<number>();

    bookingsData?.forEach((b: any) => {
      const start = new Date(b.start_at);
      const end = new Date(b.end_at);

      // Loop from start date to end date inclusive
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        datesSet.add(d.getDate()); // use Set to prevent duplicates
      }
    });

    setReservedDates(Array.from(datesSet).sort((a, b) => a - b)); // sort for display
  } catch (error) {
    console.error('Error fetching reserved dates:', error);
  }
};

  // ---------------------
  // Helpers
  // ---------------------
  const getCurrentUserId = async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
    return data.user?.id ?? null;
  };

  // ---------------------
  // Actions
  // ---------------------
 const handleAccept = async (id: number) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'approved' }) // just accept
    .eq('id', id);

  if (error) return console.error('Error accepting booking:', error);

  await supabase.from('booking_logs').insert({
    booking_id: id,
    action: 'Approved',
    performed_by: userId
  });

  fetchReservations();
};

const handleCheckIn = async (id: number) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const now = new Date().toISOString();
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('start_at')
    .eq('id', id)
    .single();

  if (error || !booking) return;

  const isEarly = new Date(now) < new Date(booking.start_at);

  await supabase
    .from('bookings')
    .update({ status: 'checked_in', checked_in_at: now, early_checkin: isEarly })
    .eq('id', id);

  await supabase.from('booking_logs').insert({
    booking_id: id,
    action: isEarly ? 'Early Check-in' : 'Checked-in',
    performed_by: userId
  });

  fetchReservations();
};

const handleCheckOut = async (id: number) => {
  const userId = await getCurrentUserId();
  if (!userId) return; // safety check

  const now = new Date().toISOString();

  // Fetch booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('end_at')
    .eq('id', id)
    .single();

  if (fetchError || !booking) {
    console.error('Booking not found or error fetching booking:', fetchError);
    return;
  }

  // Determine early check-out
  const isEarly = booking.end_at ? new Date(now) < new Date(booking.end_at) : false;

  // Update booking
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ 
      status: 'checked_out', 
      checked_out_at: now, 
      early_checkout: isEarly 
    })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating booking:', updateError);
    return;
  }

  // Log action
  const { error: logError } = await supabase.from('booking_logs').insert({
    booking_id: id,
    action: isEarly ? 'Early Check-out' : 'Checked-out',
    performed_by: userId
  });

  if (logError) console.error('Error logging check-out:', logError);

  fetchReservations();
};

    const handleDecline = async (id: number) => {
    await supabase.from('bookings').update({ status: 'declined' }).eq('id', id);
    const userId = await getCurrentUserId();
    await supabase.from('booking_logs').insert({ booking_id: id, action: 'Declined', performed_by: userId });
    fetchReservations();
  };

const handleArchive = async (bookingId: number) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;

    // 1️⃣ Fetch booking + related data
    const [{ data: booking }, { data: logs }, { data: bookingAmenities }, { data: payments }] =
      await Promise.all([
        supabase.from('bookings').select('*').eq('id', bookingId).single(),
        supabase.from('booking_logs').select('*').eq('booking_id', bookingId),
        supabase.from('booking_amenities').select('amenity_id').eq('booking_id', bookingId),
        supabase.from('payments').select('*').eq('booking_id', bookingId),
      ]);

    if (!booking) {
      console.error('Booking not found');
      return;
    }

    // 2️⃣ Fetch full amenity details
    const amenityIds = bookingAmenities?.map(a => a.amenity_id) || [];
    let amenitiesData: any[] = [];
    if (amenityIds.length > 0) {
      const { data, error } = await supabase
        .from('amenities')
        .select('id, name, price')
        .in('id', amenityIds);
      if (error) throw error;
      amenitiesData = data || [];
    }

    // 3️⃣ Fetch user (guest) info
    const { data: user } = await supabase
      .from('users')
      .select('fname, lname')
      .eq('id', booking.user_id)
      .single();

    // 4️⃣ Fetch room info
    const { data: room } = await supabase
      .from('rooms')
      .select('room_number')
      .eq('id', booking.room_id)
      .single();

    // 5️⃣ Insert into archived_bookings with full details
    const { error: archiveError } = await supabase.from('archived_bookings').insert({
      original_booking_id: booking.id,
      user_id: booking.user_id,
      guest_fname: user?.fname || 'Unknown',
      guest_lname: user?.lname || 'Guest',
      room_id: booking.room_id,
      room_number: room?.room_number || 'N/A',
      start_at: booking.start_at,
      end_at: booking.end_at,
      guests: booking.guests,
      status: booking.status,
      message: booking.message,           // store the booking message
      checked_in_at: booking.checked_in_at,
      checked_out_at: booking.checked_out_at,
      price_at_booking: booking.price_at_booking,
      total_amount: booking.total_amount,
      early_checkin: booking.early_checkin,
      early_checkout: booking.early_checkout,
      created_at: booking.created_at,
      logs: logs || [],                   // store booking logs
      amenities: amenitiesData,           // store full amenity details
      payments: payments || []            // store payments
    });

    if (archiveError) {
      console.error('Error archiving booking', archiveError);
      return;
    }

    // 6️⃣ Delete original records (only deletes booking-related info, not actual rooms/amenities)
    await Promise.all([
      supabase.from('booking_logs').delete().eq('booking_id', bookingId),
      supabase.from('booking_amenities').delete().eq('booking_id', bookingId),
      supabase.from('payments').delete().eq('booking_id', bookingId),
      supabase.from('bookings').delete().eq('id', bookingId)
    ]);

    // 7️⃣ Refresh reservations list if needed
    fetchReservations();
  } catch (err) {
    console.error('Error archiving booking', err);
  }
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
      
      <main className={`
        flex-1 transition-all duration-300 w-full
        ${isMobile ? 'ml-0' : collapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {/* Topbar - Full width */}
        <div className="w-full">
          <Topbar />
        </div>

        {/* Content Area - Fully responsive */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
          {/* Header - DRAGGED DOWN ON MOBILE ONLY, UNCHANGED ON PC/TABLET */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 ${isMobile ? 'mt-28' : 'mt-16 sm:mt-20'}`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Reservation Management
            </h1>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Tabs - Fully responsive */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 mb-6 md:mb-8">
            <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none px-3 sm:px-5 md:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              {activeTab === 'reservations' && (
  <div className="overflow-x-auto">
    {loadingReservations ? (
      <div className="flex justify-center items-center h-40 sm:h-48">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : reservations.length > 0 ? (
      <div className="min-w-full">
        <table className="w-full text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-600">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Guest</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden sm:table-cell">Date</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden md:table-cell">Time</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 sm:hidden">Details</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-gray-800 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">
                  {item.guest}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden sm:table-cell text-gray-600">{item.date}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden md:table-cell text-gray-600">{item.time}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 sm:hidden text-xs text-gray-600">
                  {item.date} {item.time}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4">
                  <div className="flex gap-1 sm:gap-2">
                    <button 
                      onClick={() => handleAccept(item.id)} 
                      className="px-2 sm:px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                      title="Accept"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => handleDecline(item.id)} 
                      className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
                      title="Decline"
                    >
                      ✗
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-6 sm:py-8 md:py-10">
        <p className="text-sm text-gray-500">No pending reservations</p>
      </div>
    )}
  </div>
)}

{ /* Check-Ins Tab */ }
      {activeTab === 'checkins' && (
  <div className="overflow-x-auto">
    {loadingReservations ? (
      <div className="flex justify-center items-center h-40 sm:h-48">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : checkIns.length > 0 ? (
      <div className="min-w-full">
        <table className="w-full text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-600">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Guest</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden sm:table-cell">Date</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden md:table-cell">Time</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 sm:hidden">Details</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Status</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkIns.map(item => {
              const statusLabel =
                item.status === 'checked_in'
                  ? item.isEarly
                    ? 'Early Check-In'
                    : 'Checked-In'
                  : 'Pending Check-In'; // accepted but not yet checked-in

              const canCheckIn = item.status === 'approved'; // show button only for accepted bookings

              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-gray-800 truncate max-w-[100px] sm:max-w-[150px]">
                    {item.guest}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden sm:table-cell text-gray-600">{item.date}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden md:table-cell text-gray-600">{item.time}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 sm:hidden text-xs text-gray-600">
                    {item.date} {item.time}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.isEarly ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4">
                    {canCheckIn && (
                      <button
                        onClick={() => handleCheckIn(item.id)}
                        className="px-2 sm:px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded hover:bg-purple-600 transition-colors whitespace-nowrap"
                      >
                        Check-In
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-6 sm:py-8 md:py-10">
        <p className="text-sm text-gray-500">No check-ins available</p>
      </div>
    )}
  </div>
)}

{/* Check-Outs Tab */}
{activeTab === 'checkouts' && (
  <div className="overflow-x-auto">
    {loadingReservations ? (
      <div className="flex justify-center items-center h-40 sm:h-48">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : checkOuts.length > 0 ? (
      <div className="min-w-full">
        <table className="w-full text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-600">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Guest</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden sm:table-cell">Date</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden md:table-cell">Time</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4 sm:hidden">Details</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Status</th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkOuts.map(item => {
              const status = item.status === 'checked_out'
                ? item.isEarly ? 'Early Check-Out' : 'Checked-Out'
                : 'Pending Check-Out';

              const canCheckOut = item.status === 'checked_in';
              const canArchive = item.status === 'checked_out';

              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 font-medium text-gray-900">{item.guest}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden sm:table-cell text-gray-600">{item.date}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 hidden md:table-cell text-gray-600">{item.time}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 sm:hidden text-xs text-gray-600">
                    {item.date} {item.time}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.isEarly ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 flex gap-1 sm:gap-2">
                    {canCheckOut && (
                      <button
                        onClick={() => handleCheckOut(item.id)}
                        className="px-2 sm:px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded hover:bg-orange-600 transition-colors whitespace-nowrap"
                      >
                        Check-Out
                      </button>
                    )}
                    {canArchive && (
                      <button
                        onClick={() => handleArchive(item.id)}
                        className="px-2 sm:px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded hover:bg-gray-600 transition-colors whitespace-nowrap"
                      >
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-6 sm:py-8 md:py-10">
        <p className="text-sm text-gray-500">No check-outs available</p>
      </div>
    )}
  </div>
)}
              {/* Room Management Tab */}
              {activeTab === 'rooms' && (
                <div className="overflow-x-auto">
                  {loadingRooms ? (
                    <div className="flex justify-center items-center h-40 sm:h-48">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : rooms.length > 0 ? (
                    <div className="min-w-full">
                      <table className="w-full text-xs sm:text-sm md:text-base">
                        <thead>
                          <tr className="border-b-2 border-gray-200 text-gray-600">
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Room</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-3 md:px-4">Clean-up Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rooms.map(item => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-teal-50 transition-colors">
                              <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 font-medium text-gray-900">Room {item.room_number}</td>
                              <td className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 text-gray-600">8AM - 10PM</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 md:py-10">
                      <p className="text-sm text-gray-500">No rooms found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Room Availability - Fully responsive */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">Room Availability</h2>
            
            {/* Room Selector */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <label htmlFor="room-select" className="text-sm font-medium text-gray-700">
                Select Room:
              </label>
              <select
                id="room-select"
                value={selectedRoom?.room_number || ''}
                onChange={handleRoomChange}
                className="w-full sm:w-48 md:w-56 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-pink-300 transition-colors"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.room_number}>Room {r.room_number}</option>
                ))}
              </select>
            </div>

            {/* Calendar */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                {monthName} – Room {selectedRoom?.room_number}
              </h3>
              
              {/* Calendar Grid - Responsive */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
               {['S','M','T','W','T','F','S'].map((day, index) => (
  <div key={index} className="text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2">
    {day}
  </div>
))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const isReserved = reservedDates.includes(day);
                  return (
                    <div
                      key={day}
                      className={`
                        p-1 sm:p-2 md:p-3 rounded-lg text-xs sm:text-sm font-medium transition-transform hover:scale-105
                        ${isReserved 
                          ? 'bg-pink-500 text-white shadow-md' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-100 rounded border border-green-200"></span>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-500 rounded"></span>
                  <span className="text-gray-600">Reserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}