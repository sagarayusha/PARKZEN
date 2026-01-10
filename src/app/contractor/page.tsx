'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useParking } from '@/hooks/use-parking';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QrCode, User, Car, Clock, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { mockUsers } from '@/lib/data';
import { getCapacityAlert } from '@/lib/actions';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function ContractorPage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { parkingLots, getLotById, checkIn, checkOut } = useParking();
  const router = useRouter();
  const { toast } = useToast();

  const [qrData, setQrData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // For this demo, the contractor is assigned to the first parking lot
  const assignedLot = parkingLots[0];

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/auth');
      } else if (user.role !== 'contractor') {
        router.replace('/home');
      }
    }
  }, [user, isAuthLoading, router]);
  
  useEffect(() => {
    if (assignedLot) {
      const checkCapacity = async () => {
        const res = await getCapacityAlert({
          currentCapacity: assignedLot.currentOccupancy,
          maxCapacity: assignedLot.capacity,
          notificationThreshold: 0.8,
          parkingLotName: assignedLot.name,
        });
        if (res.shouldSendAlert) {
          setAlertMessage(res.alertMessage);
        } else {
          setAlertMessage(null);
        }
      };
      checkCapacity();
      const interval = setInterval(checkCapacity, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [assignedLot]);

  if (isAuthLoading || !user || user.role !== 'contractor') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleScan = () => {
    setIsLoading(true);
    setScanResult(null);
    try {
        const data = JSON.parse(qrData);
        if (data.sessionId && data.userId) {
            const user = mockUsers.find(u => u.id === data.userId);
            setScanResult({ type: 'session', user, ...data });
        }
    } catch (e) {
        toast({ title: 'Invalid QR Data', description: 'The scanned data is not valid.', variant: 'destructive' });
    }
    setIsLoading(false);
  };
  
  const handleCheckIn = () => {
    if(!scanResult.vehicleNumber) {
        toast({ title: 'Missing Vehicle Number', description: 'Please ask the user to provide their vehicle number.', variant: 'destructive' });
        return;
    }
    const result = checkIn(assignedLot.id, scanResult.vehicleNumber);
    toast({ title: result.success ? 'Check-in Successful' : 'Check-in Failed', description: result.message, variant: result.success ? 'default' : 'destructive'});
    if(result.success) setScanResult(null);
  }

  const handleCheckOut = () => {
    const result = checkOut(scanResult.sessionId);
    toast({ title: result.success ? 'Check-out Successful' : 'Check-out Failed', description: result.message, variant: result.success ? 'default' : 'destructive'});
    if(result.success) setScanResult(null);
  }


  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b p-4 flex justify-between items-center">
        <div className="font-headline text-xl font-bold">SmartPark Contractor</div>
        <Button variant="ghost" size="icon" onClick={logout}><LogOut className="h-5 w-5"/></Button>
      </header>
      
      <main className="p-4 md:p-6">
        {assignedLot && (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Assigned Lot: {assignedLot.name}</CardTitle>
                    <CardDescription>Current Occupancy: {assignedLot.currentOccupancy} / {assignedLot.capacity}</CardDescription>
                </CardHeader>
                {alertMessage && (
                    <CardContent>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Capacity Alert</AlertTitle>
                            <DialogDescription>{alertMessage}</DialogDescription>
                        </Alert>
                    </CardContent>
                )}
            </Card>
        )}

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Enter the data from the user's QR code to proceed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
                <Input 
                    placeholder='e.g., {"sessionId":"...","userId":"..."}' 
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                />
                <Button onClick={handleScan} disabled={isLoading || !qrData}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <QrCode className="h-4 w-4"/>}
                    <span className="ml-2">Scan</span>
                </Button>
            </div>
            {scanResult && scanResult.user && (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> User Details</CardTitle>
                        <CardDescription>Verify the user and vehicle before proceeding.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {scanResult.user.name}</p>
                        <p><strong>Email:</strong> {scanResult.user.email}</p>
                        <p><strong>Session ID:</strong> {scanResult.sessionId}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button onClick={handleCheckOut} className="flex-1">Check-Out</Button>
                    </CardFooter>
                </Card>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
