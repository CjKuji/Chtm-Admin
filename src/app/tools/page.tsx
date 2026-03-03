"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Topbar from '@/app/components/Topbar';
import { supabase } from '@/lib/supabase';

interface Tool {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'No stock' | 'Low stock' | 'In stock';
  last_checked: string;
  created_at: string;
  total: number;
}

export default function ToolInventory() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kitchen' | 'bar' | 'baking'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);

  const [newTool, setNewTool] = useState({
    name: '',
    category: 'kitchen',
    quantity: 0,
    total: 0,
  });

  // Fetch tools from Supabase
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = categoryFilter === 'all' 
    ? tools 
    : tools.filter(t => t.category === categoryFilter);

  const showSimplifiedColumns = categoryFilter !== 'all';

  const getToolStatus = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      'No stock': { text: 'No stock', color: 'bg-red-100 text-red-700' },
      'Low stock': { text: 'Low stock', color: 'bg-yellow-100 text-yellow-700' },
      'In stock': { text: 'In stock', color: 'bg-green-100 text-green-700' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-700' };
  };

  const handleAddTool = async () => {
    try {
      const { error } = await supabase
        .from('tools')
        .insert([
          {
            name: newTool.name,
            category: newTool.category,
            quantity: newTool.quantity,
            total: newTool.total,
            status: newTool.quantity === 0 ? 'No stock' : newTool.quantity <= 10 ? 'Low stock' : 'In stock',
            last_checked: new Date().toISOString().split('T')[0],
          }
        ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewTool({
        name: '',
        category: 'kitchen',
        quantity: 0,
        total: 0,
      });

      // Refresh tools list
      fetchTools();
    } catch (error) {
      console.error('Error adding tool:', error);
      alert('Error adding tool. Please try again.');
    }
  };

  const deleteTool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Error deleting tool. Please try again.');
    }
  };

  const kitchenTools = tools.filter(t => t.category === 'kitchen');
  const barTools = tools.filter(t => t.category === 'bar');
  const bakingTools = tools.filter(t => t.category === 'baking');

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
        <Sidebar activeMenu="tools" />
        <main className="flex-1 ml-64">
          <Topbar />
          <div className="p-6 flex items-center justify-center h-96">
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar activeMenu="tools" />
      <main className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tool Inventory</h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 hover:bg-pink-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
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
                  <button
                    onClick={() => setCategoryFilter('baking')}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      categoryFilter === 'baking' 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-pink-400 hover:text-white'
                    }`}
                  >
                    Baking
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  + Add Tool
                </button>
              </div>
            </div>
          </div>

          {/* Tools Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {showSimplifiedColumns ? (
                    <>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">NAME OF TOOLS EQUIPMENT</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">QUANTITY</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">TOTAL</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">STATUS</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">ACTIONS</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Tool Name</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Category</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Quantity</th>
                      <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Total</th>
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
                    {showSimplifiedColumns ? (
                      <>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.name}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.quantity}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.total}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 text-xs rounded-full ${getToolStatus(tool.status).color}`}>
                            {getToolStatus(tool.status).text}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex gap-2">
                            <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                            <button
                              onClick={() => deleteTool(tool.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.name}</td>
                        <td className="py-3 px-6 text-sm text-gray-800 capitalize">{tool.category}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.quantity}</td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.total}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-1 text-xs rounded-full ${getToolStatus(tool.status).color}`}>
                            {getToolStatus(tool.status).text}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-800">{tool.last_checked}</td>
                        <td className="py-3 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditTool(tool);
                                setEditModalOpen(true);
                              }}
                              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTool(tool.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredTools.length === 0 && (
                  <tr>
                    <td colSpan={showSimplifiedColumns ? 5 : 7} className="py-8 text-center text-gray-500">
                      No tools found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Total Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{tools.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Kitchen Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{kitchenTools.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Bar Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{barTools.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:bg-pink-50 transition-colors duration-200">
              <p className="text-sm text-gray-600 font-medium">Baking Tools</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{bakingTools.length}</p>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-lg font-bold mb-4">Add New Tool</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name</label>
                  <input
                    type="text"
                    placeholder="Enter tool name"
                    value={newTool.name}
                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTool.category}
                    onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="kitchen">Kitchen</option>
                    <option value="bar">Bar</option>
                    <option value="baking">Baking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={newTool.quantity}
                    onChange={(e) => setNewTool({ ...newTool, quantity: Number(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                  <input
                    type="number"
                    placeholder="Enter total"
                    value={newTool.total}
                    onChange={(e) => setNewTool({ ...newTool, total: Number(e.target.value) })}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTool}
                  className="px-4 py-2 text-sm bg-pink-500 text-white rounded-md hover:bg-pink-600"
                >
                  Add Tool
                </button>
              </div>
            </div>
          </div>
        )}
          {editModalOpen && editTool && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-bold mb-4">Edit Tool</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name</label>
                    <input
                      type="text"
                      value={editTool.name}
                      onChange={(e) => setEditTool({ ...editTool, name: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editTool.category}
                      onChange={(e) => setEditTool({ ...editTool, category: e.target.value })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="kitchen">Kitchen</option>
                      <option value="bar">Bar</option>
                      <option value="baking">Baking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={editTool.quantity}
                      onChange={(e) => setEditTool({ ...editTool, quantity: Number(e.target.value) })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                    <input
                      type="number"
                      value={editTool.total}
                      onChange={(e) => setEditTool({ ...editTool, total: Number(e.target.value) })}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editTool) return;
                      try {
                        const { error } = await supabase
                          .from('tools')
                          .update({
                            name: editTool.name,
                            category: editTool.category,
                            quantity: editTool.quantity,
                            total: editTool.total,
                            status:
                              editTool.quantity === 0
                                ? 'No stock'
                                : editTool.quantity <= 10
                                ? 'Low stock'
                                : 'In stock',
                            last_checked: new Date().toISOString().split('T')[0],
                          })
                          .eq('id', editTool.id);

                        if (error) throw error;

                        setEditModalOpen(false);
                        setEditTool(null);
                        fetchTools();
                      } catch (error) {
                        console.error('Error updating tool:', error);
                        alert('Error updating tool. Please try again.');
                      }
                    }}
                    className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}