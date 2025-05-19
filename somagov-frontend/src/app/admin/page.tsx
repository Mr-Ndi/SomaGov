"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";

interface Agency {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  address: string;
  code: string;
}

export default function AdminPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }
    apiRequest<Agency[]>("/agencies", "GET", undefined, token)
      .then(setAgencies)
      .catch(() => setError("Failed to load agencies."))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Organizations</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left">Organization ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id} className="border-t">
                <td className="px-4 py-2">{agency.code || agency.id}</td>
                <td className="px-4 py-2">{agency.name}</td>
                <td className="px-4 py-2">{agency.email}</td>
                <td className="px-4 py-2">{agency.phone}</td>
                <td className="px-4 py-2">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {agency.status}
                  </span>
                </td>
                <td className="px-4 py-2">{agency.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
} 