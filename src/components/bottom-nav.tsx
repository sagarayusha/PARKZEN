'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, QrCode, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParking } from '@/hooks/use-parking';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/bookings', icon: List, label: 'Bookings' },
  { href: '/qr', icon: QrCode, label: 'My QR' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { activeSession } = useParking();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 backdrop-blur-sm md:hidden">
      <nav className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isQrActive = item.href === '/qr' && !!activeSession;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {isQrActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent/90"></span>
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
