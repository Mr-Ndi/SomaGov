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
    } catch (err: any) {
      alert(err.message || 'Login error');
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
