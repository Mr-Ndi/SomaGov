import './globals.css';
import type { Metadata } from 'next';
import Footer from './Footer';
import Navbar from '@/components/Navbar';
import GradientWrapper from '@/components/GradientWrapper';

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
        <Navbar />
        <GradientWrapper>
          {children}
        </GradientWrapper>
        <Footer />
      </body>
    </html>
  );
}
