"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    apiRequest<UserProfile>("/users/profile", "GET", undefined, token)
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name, email: data.email });
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      await apiRequest("/users/profile", "PUT", form, token || undefined);
      alert("Profile updated.");
    } catch (err) {
      setError((err as Error)?.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-primary text-center mb-4">My Profile</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary"
          placeholder="Email"
          required
        />
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-md">
          Update Profile
        </button>
      </form>
    </main>
  );
} 