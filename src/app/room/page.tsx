"use client";

import { useState, useEffect } from "react";
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import { useSidebar } from '@/app/context/SidebarContext';
import { supabase } from "@/lib/supabase";
import RoomModal, { Room, RoomType, Amenity } from "../components/RoomModal";

export default function RoomsInventory() {
  const { collapsed } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);

  // ---------- Check screen size ----------
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // ---------- Fetch rooms, room types + amenities ----------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // --- Fetch rooms with joins ---
        const { data: roomData, error: roomError } = await supabase
          .from('rooms') // no generics
          .select(`
            id,
            room_number,
            floor,
            room_type:room_types(*),
            images:room_images(*),
            amenities:room_amenities(amenity:amenities(*))
          `)
          .order('room_number', { ascending: true });

        if (roomError) throw roomError;

        if (roomData) {
          const mappedRooms: Room[] = roomData.map((r: any) => ({
            id: r.id,
            room_number: r.room_number,
            floor: r.floor,
            room_type: r.room_type?.[0] ?? { id: 0, name: "Unknown", description: null, capacity: 0, price: 0 },
            images: r.images ?? [],
            amenities: r.amenities?.map((ra: any) => ra.amenity) ?? [],
          }));
          setRooms(mappedRooms);
        }

        // --- Fetch room types ---
        const { data: roomTypesData, error: roomTypesError } = await supabase
          .from('room_types')
          .select('*')
          .order('name', { ascending: true });
        if (roomTypesError) throw roomTypesError;
        setRoomTypes(roomTypesData || []);

        // --- Fetch amenities ---
        const { data: amenitiesData, error: amenitiesError } = await supabase
          .from('amenities')
          .select('*')
          .order('name', { ascending: true });
        if (amenitiesError) throw amenitiesError;
        setAmenities(amenitiesData || []);

      } catch (err: any) {
        console.error("Error fetching data:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------- Add or Update Room ----------
  const saveRoom = async (roomData: Partial<Room>) => {
    try {
      if (selectedRoom?.id) {
        // Update existing room
        const { data, error } = await supabase
          .from('rooms')
          .update({
            room_number: roomData.room_number,
            floor: roomData.floor,
            room_type_id: roomData.room_type?.id,
          })
          .eq('id', selectedRoom.id)
          .select('*')
          .single();
        if (error) throw error;

        // Update amenities
        if (roomData.amenities) {
          await supabase.from('room_amenities').delete().eq('room_id', selectedRoom.id);
          const insertData = roomData.amenities.map(a => ({ room_id: selectedRoom.id!, amenity_id: a.id }));
          await supabase.from('room_amenities').insert(insertData);
        }

        setRooms(prev =>
          prev.map(r =>
            r.id === selectedRoom.id
              ? { ...r, ...data, amenities: roomData.amenities ?? r.amenities, images: roomData.images ?? r.images }
              : r
          )
        );
      } else {
        // Add new room
        const { data, error } = await supabase
          .from('rooms')
          .insert([{ room_number: roomData.room_number, floor: roomData.floor, room_type_id: roomData.room_type?.id }])
          .select('*')
          .single();
        if (error) throw error;

        const newRoom: Room = {
          ...data,
          room_type: roomData.room_type!,
          amenities: roomData.amenities ?? [],
          images: roomData.images ?? [],
        };
        setRooms(prev => [...prev, newRoom]);
      }

      setShowModal(false);
      setSelectedRoom(undefined);
    } catch (err: any) {
      console.error("Save room error:", err.message || err);
    }
  };

  // ---------- Delete Room ----------
  const deleteRoom = async (id: number) => {
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error("Delete room error:", err.message || err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="room" />

      <main className={`flex-1 transition-all duration-300 w-full ${isMobile ? 'ml-0' : collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="w-full">
          <Topbar />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 mt-24 sm:mt-32">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Rooms Inventory</h1>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => { setSelectedRoom(undefined); setShowModal(true); }}
            >
              Add Room
            </button>
          </div>

          {loading ? (
            <p>Loading rooms...</p>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {rooms.map(room => (
                  <div
                    key={room.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-pink-200/50 hover:bg-pink-50 transition-all duration-200"
                  >
                    <div
                      className="room-image"
                      style={{ backgroundImage: `url(${room.images?.[0]?.image_url || '/room-placeholder.png'})` }}
                    />
                    <div className="p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                        Room {room.room_number} - {room.room_type?.name ?? 'Unknown'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        {room.room_type?.description ?? 'No description available.'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Capacity: {room.room_type?.capacity ?? 0} | Price: ${room.room_type?.price ?? 0}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Amenities: {room.amenities.map(a => a.name).join(', ') || 'None'}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => { setSelectedRoom(room); setShowModal(true); }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => deleteRoom(room.id!)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showModal && (
            <RoomModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              room={selectedRoom}
              roomTypes={roomTypes}
              amenitiesList={amenities}
              onSave={saveRoom}
            />
          )}
        </div>
      </main>
    </div>
  );
}