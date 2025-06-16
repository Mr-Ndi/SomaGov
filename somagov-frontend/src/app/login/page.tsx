'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/utils/api';

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-blue-200 shadow-lg rounded-2xl p-8 sm:p-10 w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-primary">Welcome Back</h1>
        <p className="text-center text-gray-500 text-sm">Sign in to continue</p>

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
    </main>
  );
}
