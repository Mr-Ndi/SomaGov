'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/utils/api';
import Link from 'next/link';

type Complaint = {
  id: string;
  location: string;
  message: string;
  status: string;
};

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinDelayDone(true), 25000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const data = await apiRequest('/complaints/mine', 'GET', undefined, token || undefined);
      setComplaints(Array.isArray(data) ? data : []);
    };
    fetchData();
  }, []);

  if (!minDelayDone || complaints.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">My Complaints</h1>
      
      <div className="flex justify-center mb-6">
        <Link href="/complaints/new" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Submit New Complaint
        </Link>
      </div>

      <div className="space-y-4">
        {complaints.map(c => (
          <Link href={`/complaints/${c.id}`} key={c.id}>
            <div className="p-4 bg-white border rounded-md hover:bg-blue-50 transition cursor-pointer">
              <p className="font-semibold">{c.location}</p>
              <p className="text-sm text-gray-600">{c.message}</p>
              <span className="text-xs text-primary font-medium">{c.status}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/complaints/new" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Submit New Complaint
        </Link>
      </div>
    </main>
  );
}
