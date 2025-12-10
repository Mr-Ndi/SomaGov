
import Link from 'next/link';
import React from 'react';
import SlidingFeatures from '@/components/SlidingFeatures';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-gray-800 flex flex-col">
      <section className="bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">About SomaGov</h1>
        <p className="text-lg">Empowering citizens and government to build a better Rwanda together.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/register">
            <span className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-blue-100 transition">
              Join Now
            </span>
          </Link>
          <Link href="/login">
            <span className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-primary transition">
              Login
            </span>
          </Link>
        </div>
      </section>
      <section className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-4">
          SomaGov is a citizen engagement platform designed to help Rwandan citizens report public service issues and track their resolution through government agencies. Our mission is to empower citizens, improve transparency, and foster collaboration between the public and government for a better Rwanda.
        </p>
        <p className="text-gray-600">
          We believe in open communication, accountability, and the power of technology to drive positive change in society. Join us in making public services more responsive and effective for everyone.
        </p>
      </section>
      <SlidingFeatures />
    </main>
  );
}