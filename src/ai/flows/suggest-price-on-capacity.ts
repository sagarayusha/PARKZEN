'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting surge pricing based on historical parking data and current occupancy.
 *
 * - suggestPriceOnCapacity - An async function that suggests surge pricing.
 * - SuggestPriceOnCapacityInput - The input type for the suggestPriceOnCapacity function.
 * - SuggestPriceOnCapacityOutput - The return type for the suggestPriceOnCapacity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPriceOnCapacityInputSchema = z.object({
  historicalData: z.string().describe('Historical parking data in JSON format, including timestamps and occupancy rates.'),
  currentOccupancy: z.number().describe('The current occupancy of the parking lot.'),
  capacity: z.number().describe('The total capacity of the parking lot.'),
  peakHourThreshold: z.number().describe('The occupancy percentage threshold above which surge pricing should be considered (e.g., 80 for 80%).'),
  basePrice: z.number().describe('The standard hourly parking rate.'),
});
export type SuggestPriceOnCapacityInput = z.infer<typeof SuggestPriceOnCapacityInputSchema>;

const SuggestPriceOnCapacityOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested hourly parking rate based on demand and historical data.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested price, including factors considered.'),
});
export type SuggestPriceOnCapacityOutput = z.infer<typeof SuggestPriceOnCapacityOutputSchema>;

export async function suggestPriceOnCapacity(input: SuggestPriceOnCapacityInput): Promise<SuggestPriceOnCapacityOutput> {
  return suggestPriceOnCapacityFlow(input);
}

const suggestPriceOnCapacityPrompt = ai.definePrompt({
  name: 'suggestPriceOnCapacityPrompt',
  input: {schema: SuggestPriceOnCapacityInputSchema},
  output: {schema: SuggestPriceOnCapacityOutputSchema},
  prompt: `You are an AI assistant designed to suggest optimal parking prices for a municipal corporation based on current occupancy, historical data, and predefined rules.

  Analyze the provided historical parking data, current occupancy, and parking lot capacity to determine if surge pricing should be applied.

  Here are the parameters:
  Current Occupancy: {{currentOccupancy}}
  Parking Lot Capacity: {{capacity}}
  Peak Hour Threshold (%): {{peakHourThreshold}}
  Base Price: {{basePrice}}
  Historical Data: {{historicalData}}

  Consider the following factors:
  - If the current occupancy exceeds the peak hour threshold ({{peakHourThreshold}}% of capacity), suggest a surge price.
  - Analyze historical data to identify peak hours and days when higher prices can be applied.
  - The suggested price should be a multiplier of the base price, taking into account demand.
  - Provide clear reasoning for the suggested price.

  Output the suggested price and the reasoning behind it in JSON format.
  Make the suggestedPrice no more than double the basePrice.
  `,
});

const suggestPriceOnCapacityFlow = ai.defineFlow(
  {
    name: 'suggestPriceOnCapacityFlow',
    inputSchema: SuggestPriceOnCapacityInputSchema,
    outputSchema: SuggestPriceOnCapacityOutputSchema,
  },
  async input => {
    const {output} = await suggestPriceOnCapacityPrompt(input);
    return output!;
  }
);
