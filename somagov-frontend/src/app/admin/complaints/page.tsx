'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/utils/api';

type Complaint = {
  id: string;
  message: string;
  location: string;
  status: string;
  created_at?: string;
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await apiRequest<Complaint[]>('/admin/complaints?status=open&sort=latest', 'GET', undefined, token || undefined);
        setComplaints(data || []);
      } catch (error) {
        console.error('Error loading complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <main className="min-h-screen bg-background text-gray-800 px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Open Complaints</h1>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">No open complaints found.</p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="border border-blue-100 shadow bg-white rounded-lg p-6 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary">#{complaint.id}</h2>
                <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-primary capitalize">
                  {complaint.status}
                </span>
              </div>
              <p className="text-gray-700">{complaint.message}</p>
              <p className="text-sm text-gray-500">📍 {complaint.location}</p>
              {complaint.created_at && (
                <p className="text-sm text-gray-400">🕒 {new Date(complaint.created_at).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
