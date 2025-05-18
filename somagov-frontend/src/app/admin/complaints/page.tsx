'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/utils/api';

type Complaint = {
  id: string;
  message: string;
  location: string;
  status: string;
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const data = await apiRequest('/admin/complaints?status=open&sort=latest', 'GET', undefined, token || undefined);
      setComplaints(data || []);
    };
    fetchData();
  }, []);

  return (
    <main className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">Agency Dashboard</h1>
      {complaints.map(c => (
        <div key={c.id} className="bg-white border p-4 rounded-md mb-4">
          <p className="font-medium">{c.message}</p>
          <p className="text-sm text-gray-600">Location: {c.location}</p>
          <p className="text-sm text-primary">Status: {c.status}</p>
        </div>
      ))}
    </main>
  );
}
