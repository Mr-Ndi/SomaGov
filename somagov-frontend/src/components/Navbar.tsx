'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setRole(storedRole);
    };

    syncAuth()


    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    router.push('/login');

  };

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          SomaGov
        </Link>

        {/* Center: Navigation */}
        <div className="space-x-6 hidden sm:flex">
          <Link href="/" className="text-gray-700 hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-primary">
            About Us
          </Link>
          {isLoggedIn && role !== 'admin' && (
            <Link href="/complaints" className="text-gray-700 hover:text-primary">
              My Complaints
            </Link>
          )}
          {isLoggedIn && role !== 'admin' && (
            <Link href="/admin/complaints" className="text-gray-700 hover:text-primary">
              Admin Dashboard
            </Link>
          )}
          {isLoggedIn && role === 'admin' && (
            <Link href="/profile" className="text-gray-700 hover:text-primary">
              Profile
            </Link>
          )}
          {isLoggedIn && role === 'admin' && (
            <Link href="/admin" className="text-gray-700 hover:text-primary">
              Agencies
            </Link>
          )}
        </div>

        {/* Right: Auth */}
        <div className="space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
              {role !== 'admin' && (
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              )}
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
