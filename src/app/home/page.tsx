import Image from 'next/image';
import { AppLayout } from '@/components/app-layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, MapPin } from 'lucide-react';
import { mockParkingLots } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function getAvailabilityVariant(occupancy: number, capacity: number): "default" | "destructive" | "secondary" {
    const percentage = (occupancy / capacity) * 100;
    if (percentage > 90) return "destructive";
    if (percentage > 70) return "secondary";
    return "default";
}

function getAvailabilityText(occupancy: number, capacity: number): string {
    const percentage = (occupancy / capacity) * 100;
    if (percentage > 90) return "Almost Full";
    if (percentage > 70) return "High Occupancy";
    return "Available";
}

export default function HomePage() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-view');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for a parking location..." className="pl-10 h-12 text-lg" />
        </div>
        
        <Card className="mb-6 overflow-hidden">
          <CardHeader>
            <CardTitle>Nearby Parking</CardTitle>
            <CardDescription>Live parking availability near you.</CardDescription>
          </CardHeader>
          <CardContent>
            {mapImage && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                 <Image 
                    src={mapImage.imageUrl} 
                    alt={mapImage.description} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={mapImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockParkingLots.map(lot => {
            const percentage = Math.round((lot.currentOccupancy / lot.capacity) * 100);
            const badgeVariant = getAvailabilityVariant(lot.currentOccupancy, lot.capacity);

            return (
              <Card key={lot.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{lot.name}</CardTitle>
                    <Badge variant={badgeVariant}>{getAvailabilityText(lot.currentOccupancy, lot.capacity)}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 pt-1">
                    <MapPin className="h-4 w-4" />
                    {lot.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{lot.currentOccupancy} / {lot.capacity} spots</span>
                      <span className="font-semibold">{percentage}% full</span>
                    </div>
                    <div className="text-lg font-bold text-foreground pt-2">
                      ₹{lot.basePrice} <span className="text-sm font-normal text-muted-foreground">/ hour</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
