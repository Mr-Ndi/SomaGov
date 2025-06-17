"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";
import { Dialog } from '@headlessui/react';

interface Agency {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  address: string;
  code: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', address: '', status: 'Active', code: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }
    apiRequest<Agency[]>("/api/agencies", "GET", undefined, token || undefined)
      .then((data) => {
        setAgencies(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    const token = localStorage.getItem('token');
    try {
      await apiRequest('/api/agencies', 'POST', addForm, token || undefined);
      setShowAdd(false);
      setAddForm({ name: '', email: '', phone: '', address: '', status: 'Active', code: '' });
      setLoading(true);
      const data = await apiRequest<Agency[]>("/api/agencies", "GET", undefined, token || undefined);
      setAgencies(Array.isArray(data) ? data : []);
    } catch (error) {
      setAddError((error as Error)?.message || 'Failed to add agency.');
    } finally {
      setAddLoading(false);
      setLoading(false);
    }
  };

  const openCategoryModal = async (agency: Agency) => {
    setSelectedAgency(agency);
    setCatLoading(true);
    setShowCatModal(true);
    setCatError('');
    const token = localStorage.getItem('token');
    try {
      const cats = await apiRequest<Category[]>("/api/categories", "GET", undefined, token || undefined);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      setCatError('Failed to load categories.');
    } finally {
      setCatLoading(false);
    }
  };

  const handleCategoryChange = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleAssignCategories = async () => {
    if (!selectedAgency) return;
    setCatLoading(true);
    setCatError('');
    const token = localStorage.getItem('token');
    try {
      await apiRequest(`/api/agencies/${selectedAgency.id}/categories`, 'PATCH', { category_ids: selectedCategories }, token || undefined);
      setShowCatModal(false);
    } catch {
      setCatError('Failed to assign categories.');
    } finally {
      setCatLoading(false);
    }
  };
  const handleDeleteAgency = async (id: number) => {
  const confirmed = window.confirm("Are you sure you want to delete this agency?");
  if (!confirmed) return;

  const token = localStorage.getItem('token');
  try {
    await apiRequest(`/api/agencies/${id}`, 'DELETE', undefined, token || undefined);
    // Refresh agency list
    setAgencies(prev => prev.filter(agency => agency.id !== id));
  } catch (error) {
    alert('Failed to delete agency.');
  }
};


  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">🎯 Agency Management</h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Registered Agencies</h2>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            {showAdd ? 'Cancel' : '➕ Add Agency'}
          </button>
        </div>

        {showAdd && (
          <form
            onSubmit={handleAddAgency}
            className="mb-8 bg-white p-6 rounded-lg shadow border border-blue-100"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">New Agency Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Name" className="p-3 border rounded" required />
              <input name="email" value={addForm.email} onChange={handleAddChange} placeholder="Email" className="p-3 border rounded" required />
              <input name="phone" value={addForm.phone} onChange={handleAddChange} placeholder="Phone" className="p-3 border rounded" required />
              <input name="address" value={addForm.address} onChange={handleAddChange} placeholder="Address" className="p-3 border rounded" required />
              {/* <input name="code" value={addForm.code} onChange={handleAddChange} placeholder="Agency Code" className="p-3 border rounded" required /> */}
            </div>
            <button type="submit" className="mt-4 bg-primary text-white px-5 py-2 rounded hover:bg-blue-700 transition" disabled={addLoading}>
              {addLoading ? 'Adding...' : 'Add Agency'}
            </button>
            {addError && <p className="text-red-500 mt-2">{addError}</p>}
          </form>
        )}

        <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
          {agencies.length === 0 ? (
            <p className="text-gray-500 text-center p-6">No agencies found.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-blue-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((agency) => (
                  <tr key={agency.id} className="border-t hover:bg-blue-50 transition">
                    <td className="px-4 py-3">{agency.code || agency.id}</td>
                    <td className="px-4 py-3">{agency.name}</td>
                    <td className="px-4 py-3">{agency.email}</td>
                    <td className="px-4 py-3">{agency.phone}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                        {agency.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{agency.address}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openCategoryModal(agency)}
                        className="text-blue-600 underline hover:text-blue-800 transition"
                      >
                        Assign Categories
                      </button>
                      <button
                        onClick={() => handleDeleteAgency(agency.id)}
                        className="ml-3 text-red-600 underline hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Category Assignment Modal */}
        {showCatModal && selectedAgency && (
          <Dialog open={showCatModal} onClose={() => setShowCatModal(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">
                Assign Categories to <span className="text-primary">{selectedAgency.name}</span>
              </h2>
              {catError && <p className="text-red-500 mb-2">{catError}</p>}
              {catLoading ? (
                <div className="flex justify-center"><div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div></div>
              ) : (
                <div className="space-y-2 mb-4">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowCatModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Cancel</button>
                <button
                  onClick={handleAssignCategories}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
                  disabled={catLoading}
                >
                  Assign
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </main>
  );
}
