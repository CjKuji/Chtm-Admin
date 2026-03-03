"use client";


import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function RoomsInventory() {
  const areas = [
    {
      id: 'hotel101',
      title: 'Hotel Room 101',
      description:
        'A comfortable standard room with queen bed, WiFi, and AC. Perfect for business or leisure travelers.',
      img: '/room1.png',
    },
    {
      id: 'hotel102',
      title: 'Hotel Room 102',
      description:
        'Spacious deluxe room with king bed, balcony, and Jacuzzi. Enjoy a luxurious stay.',
      img: '/room2.jpg',
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="room" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Facilities Inventory</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-pink-200/50 hover:bg-pink-50 transition-all duration-200"
                >
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${area.img})` }} />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{area.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{area.description}</p>
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