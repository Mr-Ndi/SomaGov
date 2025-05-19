'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function NewComplaintPage() {
  const [form, setForm] = useState({ location: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      await apiRequest('/complaints', 'POST', form, token || undefined);
      alert('Complaint submitted.');
      router.push('/complaints');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
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
    <main className="min-h-screen bg-background flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold text-primary text-center">Submit a Complaint</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
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
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">
          Submit
        </button>
      </form>
    </main>
  );
}
