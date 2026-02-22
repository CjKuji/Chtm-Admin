"use client";

import React, { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';

export default function ToolInventory() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kitchen' | 'bar'>('all');

  // Kitchen tools (original) – removed hardcoded status
  const kitchenTools = [
    { id: 1, name: 'Chef Knife', category: 'kitchen', quantity: 8, unit: 'PCS', remarks: '', lastChecked: '2026-02-20' },
    { id: 2, name: 'Cutting Board', category: 'kitchen', quantity: 5, unit: 'PCS', remarks: '', lastChecked: '2026-02-19' },
    { id: 3, name: 'Frying Pan', category: 'kitchen', quantity: 6, unit: 'PCS', remarks: '', lastChecked: '2026-02-18' },
    { id: 4, name: 'Mixing Bowl', category: 'kitchen', quantity: 4, unit: 'PCS', remarks: '', lastChecked: '2026-02-17' },
    { id: 5, name: 'Whisk', category: 'kitchen', quantity: 7, unit: 'PCS', remarks: '', lastChecked: '2026-02-20' },
  ];

  // Bar tools from the provided list – removed hardcoded status
  const barTools = [
    { id: 101, name: 'DENNER PLATE', category: 'bar', quantity: 0, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 102, name: 'FISH PLATT/DESSERT PLATE', category: 'bar', quantity: 20, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 103, name: 'SALAD PLATE', category: 'bar', quantity: 50, unit: 'POS', remarks: '', lastChecked: '2026-02-22' },
    { id: 104, name: 'BREAD PLATE', category: 'bar', quantity: 10, unit: 'POS', remarks: '', lastChecked: '2026-02-22' },
    { id: 105, name: 'BALICEM', category: 'bar', quantity: 42, unit: 'PCX', remarks: '', lastChecked: '2026-02-22' },
    { id: 106, name: 'ATILITY BOWL', category: 'bar', quantity: 10, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 107, name: 'WATER GOULET', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 108, name: 'RED WINE GLASS', category: 'bar', quantity: 10, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 109, name: 'WIREE WINE GLASS', category: 'bar', quantity: 10, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 110, name: 'CHAMPAGNE GLASS', category: 'bar', quantity: 0, unit: 'PES', remarks: '', lastChecked: '2026-02-22' },
    { id: 111, name: 'MARTINI GLASS', category: 'bar', quantity: 0, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 112, name: 'BUTTER ANIFE', category: 'bar', quantity: 0, unit: 'POS', remarks: '', lastChecked: '2026-02-22' },
    { id: 113, name: 'DINNER SPOON', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 114, name: 'DINNER FORK', category: 'bar', quantity: 56, unit: 'PS', remarks: '', lastChecked: '2026-02-22' },
    { id: 115, name: 'DINNER KNIVE', category: 'bar', quantity: 0, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 116, name: 'STEAK KNIFE', category: 'bar', quantity: 10, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 117, name: 'SOLUP SPOON', category: 'bar', quantity: 50, unit: 'PCE', remarks: '', lastChecked: '2026-02-22' },
    { id: 118, name: 'SALAD KNIFE', category: 'bar', quantity: 0, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 119, name: 'SALAD PORK', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 120, name: 'FISH KNIFE', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 121, name: 'FISH FORC', category: 'bar', quantity: 30, unit: 'POS', remarks: '', lastChecked: '2026-02-22' },
    { id: 122, name: 'OYSTER FORK', category: 'bar', quantity: 0, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 123, name: 'DESSERT FORK', category: 'bar', quantity: 0, unit: 'PCE', remarks: '', lastChecked: '2026-02-22' },
    { id: 124, name: 'DESSERT SPOON', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 125, name: 'COFFEE SPOON TEASPOON', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
    { id: 126, name: 'HAL-HALO SPOON', category: 'bar', quantity: 50, unit: 'PCS', remarks: '', lastChecked: '2026-02-22' },
  ];

  const allTools = [...kitchenTools, ...barTools];

  const filteredTools = categoryFilter === 'all' 
    ? allTools 
    : allTools.filter(t => t.category === categoryFilter);

  const showBarColumns = categoryFilter === 'bar';

  // Helper to determine status based on quantity
  const getToolStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (quantity <= 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Available', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="tools" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tool Inventory</h1>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
              + Add Tool
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 hover:bg-pink-50 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filter by category:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    categoryFilter === 'all' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-pink-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCategoryFilter('kitchen')}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    categoryFilter === 'kitchen' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-pink-400 hover:text-white'
                  }`}
                >
                  Kitchen
                </button>
                <button
                  onClick={() => setCategoryFilter('bar')}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    categoryFilter === 'bar' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-pink-400 hover:text-white'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>

          {/* Tools Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {showBarColumns ? (
                    <>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">NAME OF TOOLS EQUIPMENT</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">QUANTITY</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">UNIT</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">REMARKS</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">ACTIONS</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Tool Name</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Category</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Quantity</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Last Checked</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="border-b border-gray-100 hover:bg-pink-50 transition-colors duration-200">
                    {showBarColumns ? (
                      <>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.name}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.quantity}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.unit}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.remarks}</td>
                        <td className="py-3 px-6">
                          <div className="flex gap-2">
                            <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                            <button className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.name}</td>
                        <td className="py-3 px-6 text-sm text-gray-800 capitalize">{tool.category}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.quantity}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 text-xs rounded-full ${getToolStatus(tool.quantity).color}`}>
                            {getToolStatus(tool.quantity).text}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.lastChecked}</td>
                        <td className="py-3 px-6">
                          <div className="flex gap-2">
                            <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                            <button className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredTools.length === 0 && (
                  <tr>
                    <td colSpan={showBarColumns ? 5 : 6} className="py-8 text-center text-gray-500">
                      No tools found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Cards with pink hover */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Total Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{allTools.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Kitchen Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{kitchenTools.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Bar Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{barTools.length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}