import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto py-6 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-lg font-bold">
          <Link href="/">
            SomaGov
          </Link>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </nav>
        <div className="text-xs text-blue-100">&copy; {new Date().getFullYear()} SomaGov. All rights reserved.</div>
      </div>
    </footer>
  );
} 