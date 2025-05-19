'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      router.push('/complaints');
    } else {
      alert(data.message || 'Login failed.');
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white border border-blue-200 p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-primary text-center">Login</h1>

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
          Sign In
        </button>
      </form>
    </main>
  );
}
