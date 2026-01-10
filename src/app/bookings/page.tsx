'use client';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParking } from '@/hooks/use-parking';
import { Clock, MapPin, Car, IndianRupee, Calendar } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function BookingsPage() {
  const { userSessions } = useParking();

  const activeSessions = userSessions.filter(s => !s.checkOutTime);
  const pastSessions = userSessions.filter(s => s.checkOutTime);

  return (
    <AppLayout>
      <PageHeader title="My Bookings" description="View your active and past parking sessions." />
      <div className="px-4 md:px-6">
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Session</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {activeSessions.length > 0 ? (
              activeSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No active parking session.</p>
                <p className="text-sm">Find a parking spot on the home page to start.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="history">
            {pastSessions.length > 0 ? (
                <div className="space-y-4">
                    {pastSessions.map(session => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 text-muted-foreground">
                    <p>No past sessions found.</p>
                 </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function SessionCard({ session }: { session: import('@/lib/types').ParkingSession }) {
    const { getLotById } = useParking();
    const lot = getLotById(session.parkingLotId);
    const isActive = !session.checkOutTime;

    return (
        <Card className={isActive ? "border-primary" : ""}>
            <CardHeader>
                <CardTitle>{lot?.name || 'Unknown Lot'}</CardTitle>
                <CardDescription className="flex items-center gap-1 pt-1"><MapPin className="h-4 w-4" />{lot?.address}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>{session.vehicleNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {format(session.checkInTime, 'PPp')}
                        {isActive && ` (${formatDistanceToNow(session.checkInTime, { addSuffix: true })})`}
                    </span>
                </div>
                {session.checkOutTime && (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Checked out: {format(session.checkOutTime, 'PPp')}</span>
                    </div>
                )}
                {session.cost !== undefined && (
                     <div className="flex items-center gap-2 font-semibold">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span>Total Cost: ₹{session.cost}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
