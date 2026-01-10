'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/auth');
      } else if (user.role !== 'official') {
        router.replace('/home'); // Or an unauthorized page
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'official') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <DashboardSidebar />
        </Sidebar>
        <SidebarInset>
            <div className="min-h-screen">
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
