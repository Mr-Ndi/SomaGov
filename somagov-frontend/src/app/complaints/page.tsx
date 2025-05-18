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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const data = await apiRequest('/complaints/mine', 'GET', undefined, token || undefined);
      setComplaints(data || []);
    };
    fetchData();
  }, []);

  return (
    <main className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">My Complaints</h1>
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
    </main>
  );
}
