import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SomaGov',
  description: 'Citizen engagement platform for Rwanda',
  icons: {
    icon: [
      { url: '/icon2.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon2.png', type: 'image/png' },
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
