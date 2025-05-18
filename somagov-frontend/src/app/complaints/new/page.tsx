'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function NewComplaintPage() {
  const [form, setForm] = useState({ location: '', message: '' });
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
    const token = localStorage.getItem('token');
    const result = await apiRequest('/complaints', 'POST', form, token || undefined) as any;
    alert(result.message || 'Complaint submitted.');
  };

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
          name="message"
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
