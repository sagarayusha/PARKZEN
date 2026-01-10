'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { useParking } from '@/hooks/use-parking';
import { IndianRupee, Car, AlertTriangle } from 'lucide-react';
import type { ParkingLot } from '@/lib/types';
import { useMemo } from 'react';

function getStatus(lot: ParkingLot): { text: string; variant: "default" | "destructive" | "secondary" | "outline" } {
  const percentage = (lot.currentOccupancy / lot.capacity) * 100;
  if (percentage >= 95) return { text: "Full", variant: "destructive" };
  if (percentage >= 80) return { text: "High", variant: "secondary" };
  if (percentage < 10) return { text: "Low", variant: "outline" };
  return { text: "Moderate", variant: "default" };
}

export default function DashboardPage() {
  const { parkingLots } = useParking();

  const totalCapacity = useMemo(() => parkingLots.reduce((acc, lot) => acc + lot.capacity, 0), [parkingLots]);
  const totalOccupancy = useMemo(() => parkingLots.reduce((acc, lot) => acc + lot.currentOccupancy, 0), [parkingLots]);
  const totalRevenue = useMemo(() => parkingLots.reduce((acc, lot) => acc + lot.currentOccupancy * lot.basePrice * 0.5, 0), [parkingLots]); // Mocked revenue
  const lotsNearingCapacity = useMemo(() => parkingLots.filter(lot => (lot.currentOccupancy / lot.capacity) >= 0.8).length, [parkingLots]);

  const chartData = parkingLots.map(lot => ({
    name: lot.name.split(' ').slice(0, 2).join(' '),
    occupancy: lot.currentOccupancy,
    capacity: lot.capacity
  }));

  return (
    <DashboardLayout>
      <PageHeader title="Dashboard Overview" description={`Welcome back! Here's a live look at your city's parking.`} />
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Based on current occupancy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Occupancy</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOccupancy} / {totalCapacity}</div>
              <p className="text-xs text-muted-foreground">Total spots filled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                 <div className="text-2xl font-bold">
                    {totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0}%
                </div>
            </CardHeader>
             <CardContent>
              <p className="text-xs text-muted-foreground">Network-wide average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Traffic Lots</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lotsNearingCapacity}</div>
              <p className="text-xs text-muted-foreground">Lots over 80% capacity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Lot Occupancy</CardTitle>
              <CardDescription>A real-time snapshot of spots filled in each lot.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} angle={-30} textAnchor="end" height={50} />
                        <YAxis />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="occupancy" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parking Lots Status</CardTitle>
              <CardDescription>Detailed view of all managed parking locations.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="max-h-[350px] overflow-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Lot Name</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Occupancy</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {parkingLots.map(lot => {
                        const status = getStatus(lot);
                        return (
                        <TableRow key={lot.id}>
                            <TableCell className="font-medium">{lot.name}</TableCell>
                            <TableCell className="text-center"><Badge variant={status.variant}>{status.text}</Badge></TableCell>
                            <TableCell className="text-right">{lot.currentOccupancy} / {lot.capacity}</TableCell>
                        </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
