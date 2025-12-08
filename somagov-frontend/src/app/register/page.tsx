'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import SlidingFeatures from '@/components/SlidingFeatures';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Registering with API:', `${process.env.NEXT_PUBLIC_API_BASE}/api/register`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(data.message || data.error || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred. Please try again.');
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
    <main className="min-h-screen bg-background flex flex-col">
      <section className="bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Join SomaGov</h1>
        <p className="text-lg">Create an account to report issues and help improve public services.</p>
      </section>

      <div className="flex-grow flex flex-col items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="bg-white border border-blue-100 p-8 rounded-lg shadow w-full max-w-lg space-y-4 mb-12">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition"
          >
            Create Account
          </button>
        </form>
      </div>

      <SlidingFeatures />
    </main>
  );
}

