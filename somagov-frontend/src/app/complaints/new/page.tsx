'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Category { id: number; name: string; }
interface Agency { id: number; name: string; }

export default function NewComplaintPage() {
  const [form, setForm] = useState({ location: '', description: '', category_id: '', agency_id: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    // Fetch categories and agencies
    Promise.all([
      apiRequest('/api/categories', 'GET', undefined, token || undefined),
      apiRequest('/api/agencies', 'GET', undefined, token || undefined),
    ]).then(([cat, ag]) => {
      setCategories(cat as Category[]);
      setAgencies(ag as Agency[]);
    }).catch(() => {
      setError('No categories or agencies found.');
    }).finally(() => setMetaLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      await apiRequest('/complaints', 'POST', {
        location: form.location,
        description: form.description,
        category_id: Number(form.category_id),
        agency_id: Number(form.agency_id),
      }, token || undefined);
      alert('Complaint submitted.');
      router.push('/complaints');
    } catch (err) {
      setError((err as Error)?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || metaLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold text-primary text-center">Submit a Complaint</h1>
        <input
          name="location"
          type="text"
          placeholder="e.g. Gasabo"
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
          required
        />
        <textarea
          name="description"
          rows={4}
          placeholder="Describe the issue"
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
          required
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          name="agency_id"
          value={form.agency_id}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Select Agency</option>
          {agencies.map(ag => (
            <option key={ag.id} value={ag.id}>{ag.name}</option>
          ))}
        </select>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">
          Submit
        </button>
      </form>
    </main>
  );
}
