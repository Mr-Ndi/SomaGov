'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/utils/api';
import SlidingFeatures from '@/components/SlidingFeatures';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

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
  const [showPassword, setShowPassword] = useState(false);

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
          window.dispatchEvent(new Event('auth-change'));
          router.push(role === 'admin' ? '/admin' : '/complaints');
        }
      } else {
        toast.error('Wrong credentials');
      }
    } catch (err: any) {
      // If error is 401, show wrong credentials
      if (err?.message?.toLowerCase().includes('401') || err?.message?.toLowerCase().includes('unauthorized')) {
        toast.error('Wrong credentials');
      } else {
        const message = err instanceof Error ? err.message : 'Login error';
        toast.error(message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Welcome Back"
        description="Sign in to continue reporting issues and tracking progress."
      />

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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575m-2.122 2.122A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575m2.122-2.122A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575m-2.122 2.122A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition duration-200 shadow-md"
          >
            Sign In
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-2">
            <span>
              No account?{' '}
              <Link href="/register" className="text-primary hover:underline">Create one</Link>
            </span>
            <span>
              <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </span>
          </div>
        </form>
      </div>

      <SlidingFeatures />
    </main>
  );
}
