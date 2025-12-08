'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/utils/api';
import SlidingFeatures from '@/components/SlidingFeatures';

function decodeRoleFromJWT(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiRequest<{ token: string }>('/api/login', 'POST', form);

      if (data.token) {
        localStorage.setItem('token', data.token);
        const role = decodeRoleFromJWT(data.token);
        if (role) {
          localStorage.setItem('role', role);
          router.push(role === 'admin' ? '/admin' : '/complaints');
        }
      } else {
        alert('Login failed.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login error';
      alert(message);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <section className="bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg">Sign in to continue reporting issues and tracking progress.</p>
      </section>

      <div className="flex-grow flex flex-col items-center justify-center p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-blue-100 shadow rounded-lg p-8 sm:p-12 w-full max-w-lg space-y-6 mb-12"
        >
          {/* ... existing form fields ... */}
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition duration-200 shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>

      <SlidingFeatures />
    </main>
  );
}
