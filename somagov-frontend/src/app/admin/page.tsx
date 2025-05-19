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

interface Category { id: number; name: string; }

export default function AdminPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Add Agency Form State
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
      // Refresh agencies
      setLoading(true);
      const data = await apiRequest<Agency[]>("/api/agencies", "GET", undefined, token || undefined);
      setAgencies(Array.isArray(data) ? data : []);
      setError("");
    } catch (err: any) {
      setAddError(err.message || 'Failed to add agency.');
    } finally {
      setAddLoading(false);
      setLoading(false);
    }
  };

  // Fetch categories when opening modal
  const openCategoryModal = async (agency: Agency) => {
    setSelectedAgency(agency);
    setCatLoading(true);
    setShowCatModal(true);
    setCatError('');
    const token = localStorage.getItem('token');
    try {
      const cats = await apiRequest<Category[]>("/api/categories", "GET", undefined, token || undefined);
      setCategories(Array.isArray(cats) ? cats : []);
      // Optionally fetch agency's current categories and setSelectedCategories([...])
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
      // PATCH or PUT to /api/agencies/:id/categories
      await apiRequest(`/api/agencies/${selectedAgency.id}/categories`, 'PATCH', { category_ids: selectedCategories }, token || undefined);
      setShowCatModal(false);
    } catch {
      setCatError('Failed to assign categories.');
    } finally {
      setCatLoading(false);
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
      <h1 className="text-2xl font-bold text-primary mb-6">Organizations</h1>
      <button onClick={() => setShowAdd(!showAdd)} className="mb-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        {showAdd ? 'Cancel' : 'Add Agency'}
      </button>
      {showAdd && (
        <form onSubmit={handleAddAgency} className="mb-6 bg-white p-4 rounded shadow max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Name" className="p-2 border rounded" required />
            <input name="email" value={addForm.email} onChange={handleAddChange} placeholder="Email" className="p-2 border rounded" required />
            <input name="phone" value={addForm.phone} onChange={handleAddChange} placeholder="Phone" className="p-2 border rounded" required />
            <input name="address" value={addForm.address} onChange={handleAddChange} placeholder="Address" className="p-2 border rounded" required />
            <input name="code" value={addForm.code} onChange={handleAddChange} placeholder="Organization ID" className="p-2 border rounded" required />
          </div>
          <button type="submit" className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add Agency'}
          </button>
          {addError && <div className="text-red-500 mt-2">{addError}</div>}
        </form>
      )}
      <div className="overflow-x-auto">
        {agencies.length === 0 ? (
          <div className="text-gray-500 text-lg">No agencies found. Add one above.</div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left">Organization ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.id} className="border-t">
                  <td className="px-4 py-2">{agency.code || agency.id}</td>
                  <td className="px-4 py-2">{agency.name}</td>
                  <td className="px-4 py-2">{agency.email}</td>
                  <td className="px-4 py-2">{agency.phone}</td>
                  <td className="px-4 py-2">
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {agency.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{agency.address}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => openCategoryModal(agency)} className="text-blue-600 underline">Assign Categories</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Category Modal */}
      {showCatModal && selectedAgency && (
        <Dialog open={showCatModal} onClose={() => setShowCatModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Assign Categories to {selectedAgency.name}</h2>
            {catError && <div className="text-red-500 mb-2">{catError}</div>}
            {catLoading ? (
              <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary"></div></div>
            ) : (
              <div className="mb-4 grid grid-cols-1 gap-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => handleCategoryChange(cat.id)} />
                    {cat.name}
                  </label>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCatModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              <button onClick={handleAssignCategories} className="px-4 py-2 rounded bg-primary text-white" disabled={catLoading}>Assign</button>
            </div>
          </div>
        </Dialog>
      )}
    </main>
  );
} 