import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { ParkingProvider } from '@/contexts/parking-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartPark',
  description: 'Smart Parking Capacity Enforcement for Municipal Corporations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ParkingProvider>
            {children}
            <Toaster />
          </ParkingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
