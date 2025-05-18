import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SomaGov',
  description: 'Citizen engagement platform for Rwanda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
