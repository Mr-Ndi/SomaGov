'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/utils/api';

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<any>(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      const token = localStorage.getItem('token');
      const data = await apiRequest(`/complaints/${id}`, 'GET', undefined, token || undefined);
      setComplaint(data);
    };
    fetchComplaint();
  }, [id]);

  if (!complaint) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-4">Complaint Detail</h1>
      <div className="bg-white border p-6 rounded-md space-y-2">
        <p><strong>Location:</strong> {complaint.location}</p>
        <p><strong>Message:</strong> {complaint.message}</p>
        <p><strong>Status:</strong> <span className="text-primary">{complaint.status}</span></p>
        {complaint.response && (
          <div className="mt-4 p-4 border-t text-sm text-gray-800">
            <strong>Agency Response:</strong>
            <p>{complaint.response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
