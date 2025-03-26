// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Document Assistant',
  description: 'Upload, improve, and manage your documents with AI-powered suggestions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}