import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientProviders from './providers';
import { NextUIProvider } from '@nextui-org/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  description: 'Quản lý dữ liệu nội bộ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="light">
      <body className={inter.className}>
        <NextUIProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </NextUIProvider>
      </body>
    </html>
  );
}
