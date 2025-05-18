import './globals.css';
import type { Metadata } from 'next';
import Footer from './Footer';

export const metadata: Metadata = {
  title: 'SomaGov',
  description: 'Citizen engagement platform for Rwanda',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
