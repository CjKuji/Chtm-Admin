"use client";

import React from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function RoomsInventory() {
  const rooms = [
    {
      id: '101',
      title: 'Room 101',
      description:
        'Etiam pharetra erat sed fermentum feugiat velit mauris egestas quam, ut aliquam massa nisl suspendisse in orci enim.',
      price: 500000,
      img: 'https://via.placeholder.com/800x450?text=Room+101',
    },
    {
      id: '102',
      title: 'Room 102',
      description:
        'Etiam pharetra erat sed fermentum feugiat velit mauris egestas quam, ut aliquam massa nisl suspendisse in orci enim.',
      price: 1500000,
      img: 'https://via.placeholder.com/800x450?text=Room+102',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeMenu="room" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Room Inventory</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${r.img})` }} />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{r.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}