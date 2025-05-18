import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-gray-800">
      <section className="bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to SomaGov</h1>
        <p className="text-lg">A citizen feedback platform to report issues and improve public services in Rwanda.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/register">
            <span className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-blue-100 transition">
              Get Started
            </span>
          </Link>
          <Link href="/login">
            <span className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-primary transition">
              Login
            </span>
          </Link>
        </div>
      </section>

      <section className="p-10 max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Link href="/complaints/new" className="w-full sm:w-1/2 bg-primary text-white text-lg font-semibold py-4 rounded-md text-center hover:bg-blue-700 transition">
            Submit a Complaint
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-lg shadow border border-blue-100 p-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Submit Complaints</h3>
            <p>Report issues about public services anonymously or with an account.</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-blue-100 p-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Track Progress</h3>
            <p>Receive updates and track resolution status using your ticket ID.</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-blue-100 p-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Multilingual Support</h3>
            <p>Submit in Kinyarwanda or English, system translates automatically.</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-blue-100 p-6">
            <h3 className="text-xl font-semibold text-primary mb-2">Government Response</h3>
            <p>Agencies view, respond, and resolve complaints transparently.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
