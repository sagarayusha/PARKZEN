'use client';

import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { QrCode } from '@/components/qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useParking } from '@/hooks/use-parking';
import { Clock, MapPin, Car, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function QrPage() {
  const { activeSession, getLotById, checkOut } = useParking();
  const { toast } = useToast();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const lot = activeSession ? getLotById(activeSession.parkingLotId) : null;

  const handleCheckout = () => {
    if (!activeSession) return;
    setIsCheckingOut(true);
    setTimeout(() => { // Simulate network delay
      const result = checkOut(activeSession.id);
      if (result.success) {
        toast({
          title: "Check-out Successful",
          description: "Your session has ended. Thank you for using SmartPark!",
        });
        router.push('/bookings');
      } else {
        toast({
          title: "Check-out Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <PageHeader title="My Active Session" description="Show this QR to the attendant to check-in or check-out." />
      <div className="flex justify-center p-4">
        {activeSession && lot ? (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl">{lot.name}</CardTitle>
              <CardDescription className="text-center">{lot.address}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <QrCode value={JSON.stringify({ sessionId: activeSession.id, userId: activeSession.userId })} />
              <div className="grid gap-2 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>{activeSession.vehicleNumber}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Parked for {formatDistanceToNow(activeSession.checkInTime)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Out
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md text-center p-10">
            <CardTitle>No Active Session</CardTitle>
            <CardDescription className="mt-2">
              You do not have an active parking session. When you check-in at a lot, your QR code will appear here.
            </CardDescription>
            <Button className="mt-6" onClick={() => router.push('/home')}>Find Parking</Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
