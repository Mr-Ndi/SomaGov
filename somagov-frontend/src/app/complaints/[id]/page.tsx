'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/utils/api';

type Complaint = {
  id: string;
  location: string;
  message: string;
  status: string;
  response?: string;
  created_at?: string;
};

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinDelayDone(true), 25000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchComplaint = async () => {
      const token = localStorage.getItem('token');
      const data = await apiRequest(`/api/complaints/${id}`, 'GET', undefined, token || undefined);
      setComplaint(data as unknown as Complaint);
    };
    fetchComplaint();
  }, [id]);

  if (!complaint || !minDelayDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

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
