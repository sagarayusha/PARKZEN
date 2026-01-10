'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParking } from '@/hooks/use-parking';
import { getPriceSuggestion } from '@/lib/actions';
import { Loader2, Zap, IndianRupee } from 'lucide-react';
import type { ParkingLot } from '@/lib/types';
import type { SuggestPriceOnCapacityOutput } from '@/ai/flows/suggest-price-on-capacity';

export default function PricingPage() {
  const { parkingLots } = useParking();
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestPriceOnCapacityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedLot = parkingLots.find(lot => lot.id === selectedLotId);

  const handleSuggestPrice = async () => {
    if (!selectedLot) return;

    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const historicalData = JSON.stringify(selectedLot.historicalData);
      const result = await getPriceSuggestion({
        historicalData: historicalData,
        currentOccupancy: selectedLot.currentOccupancy,
        capacity: selectedLot.capacity,
        peakHourThreshold: 80, // Example threshold
        basePrice: selectedLot.basePrice,
      });
      setSuggestion(result);
    } catch (e) {
      setError('Failed to generate suggestion. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Pricing Analytics"
        description="Leverage AI to suggest dynamic surge pricing based on real-time demand."
      />
      <div className="p-4 md:p-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select a Parking Lot</CardTitle>
            <CardDescription>Choose a lot to analyze and receive a pricing suggestion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedLotId} value={selectedLotId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select a parking lot..." />
              </SelectTrigger>
              <SelectContent>
                {parkingLots.map(lot => (
                  <SelectItem key={lot.id} value={lot.id}>{lot.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedLot && (
              <div className="rounded-lg border bg-muted/50 p-4 text-sm space-y-2">
                <p><strong>Capacity:</strong> {selectedLot.currentOccupancy} / {selectedLot.capacity}</p>
                <p><strong>Current Base Price:</strong> ₹{selectedLot.basePrice} / hour</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSuggestPrice} disabled={!selectedLotId || isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Zap className="mr-2 h-4 w-4" /> Suggest Surge Price</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Suggestion</CardTitle>
            <CardDescription>The AI's recommended price based on the data.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
            {error && <p className="text-destructive">{error}</p>}
            {!isLoading && !suggestion && !error && (
              <p className="text-muted-foreground text-center">Your suggestion will appear here.</p>
            )}
            {suggestion && (
              <div className="text-center">
                <p className="text-muted-foreground">Suggested Price</p>
                <div className="flex items-baseline justify-center gap-2 my-2">
                  <IndianRupee className="h-10 w-10 text-primary" />
                  <p className="text-6xl font-bold text-primary">{suggestion.suggestedPrice}</p>
                  <p className="text-muted-foreground self-end">/ hour</p>
                </div>
                <Card className="mt-4 bg-background text-left">
                  <CardHeader>
                    <CardTitle className="text-base">Reasoning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
