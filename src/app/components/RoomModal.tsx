"use client";

import { useState, useEffect } from "react";

export interface RoomType {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  price: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  price: number;
}

export interface RoomImage {
  id: number;
  image_url: string;
}

export interface Room {
  id?: number;
  room_number: string;
  floor: number | null;
  room_type: RoomType | null;
  amenities: Amenity[];
  images: RoomImage[];
}

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room; // optional for edit
  roomTypes: RoomType[];
  amenitiesList: Amenity[];
  onSave: (room: Partial<Room>) => void;
}

export default function RoomModal({
  isOpen,
  onClose,
  room,
  roomTypes,
  amenitiesList,
  onSave,
}: RoomModalProps) {
  const [roomNumber, setRoomNumber] = useState<string>(room?.room_number || "");
  const [floor, setFloor] = useState<number | null>(room?.floor ?? null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(room?.room_type ?? null);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    room?.amenities.map((a: Amenity) => a.id) || []
  );
  const [imageURL, setImageURL] = useState<string>(room?.images?.[0]?.image_url || "");

  useEffect(() => {
    if (room) {
      setRoomNumber(room.room_number);
      setFloor(room.floor);
      setSelectedRoomType(room.room_type);
      setSelectedAmenities(room.amenities.map((a: Amenity) => a.id));
      setImageURL(room.images?.[0]?.image_url || "");
    } else {
      setRoomNumber("");
      setFloor(null);
      setSelectedRoomType(null);
      setSelectedAmenities([]);
      setImageURL("");
    }
  }, [room]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!roomNumber || !selectedRoomType) {
      alert("Room number and type are required!");
      return;
    }

    const newRoom: Partial<Room> = {
      room_number: roomNumber,
      floor,
      room_type: selectedRoomType,
      amenities: amenitiesList.filter((a: Amenity) => selectedAmenities.includes(a.id)),
      images: imageURL ? [{ id: 0, image_url: imageURL }] : [],
    };

    onSave(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">{room ? "Edit Room" : "Add Room"}</h2>

        {/* Room Number */}
        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Floor */}
        <input
          type="number"
          placeholder="Floor"
          value={floor ?? ""}
          onChange={(e) => setFloor(e.target.value ? Number(e.target.value) : null)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Room Type */}
        <select
          value={selectedRoomType?.id ?? ""}
          onChange={(e) => {
            const rt = roomTypes.find((r: RoomType) => r.id === Number(e.target.value));
            setSelectedRoomType(rt || null);
          }}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((rt: RoomType) => (
            <option key={rt.id} value={rt.id}>{rt.name}</option>
          ))}
        </select>

        {/* Amenities Multi-select */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Amenities</label>
          <select
            multiple
            value={selectedAmenities.map(String)}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map((o: HTMLOptionElement) =>
                Number(o.value)
              );
              setSelectedAmenities(selectedOptions);
            }}
            className="w-full border p-2 rounded h-24"
          >
            {amenitiesList.map((a: Amenity) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Image URL */}
        <input
          type="text"
          placeholder="Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}