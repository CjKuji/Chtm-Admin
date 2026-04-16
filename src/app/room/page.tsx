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
        const roomData = [
          {
            id: 1,
            room_number: "Room 1",
            floor: 1,
            room_type: { id: 1, name: "Non-Aircon Standard Room", description: "2 Single bed", capacity: 2, price: 2500 },
            images: [],
            amenities: [
              { id: 1, name: "TV" },
              { id: 2, name: "Cabinet" },
              { id: 3, name: "Shower" }
            ],
            status: "Available"
          },
          {
            id: 2,
            room_number: "Room 2",
            floor: 2,
            room_type: { id: 2, name: "Aircon Deluxe Room", description: "2 Bed King Size", capacity: 2, price: 4500 },
            images: [],
            amenities: [
              { id: 4, name: "Mini sala" },
              { id: 5, name: "Cabinet TV" },
              { id: 6, name: "Bath tub" }
            ],
            status: "Under Maintenance"
          }
        ];

        setRooms(roomData);
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

  // ---------- Update Room Status ----------
  const updateRoomStatus = (id: number, status: string) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === id ? { ...room, status } : room
      )
    );
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
                        {room.room_number} - {room.room_type?.name ?? 'Unknown'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        {room.room_type?.description ?? 'No description available.'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Capacity: {room.room_type?.capacity ?? 0} | Price: ₱{room.room_type?.price ?? 0}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Amenities: {room.amenities.map(a => a.name).join(', ') || 'None'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Status: {room.status || 'Available'}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => updateRoomStatus(room.id!, 'Under Maintenance')}
                        >
                          Under Maintenance
                        </button>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded"
                          onClick={() => updateRoomStatus(room.id!, 'Available')}
                        >
                          Complete
                        </button>
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