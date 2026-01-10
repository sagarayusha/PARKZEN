'use server';

import { suggestPriceOnCapacity, SuggestPriceOnCapacityInput, SuggestPriceOnCapacityOutput } from '@/ai/flows/suggest-price-on-capacity';
import { dynamicCapacityAlert, DynamicCapacityAlertInput, DynamicCapacityAlertOutput } from '@/ai/flows/dynamic-capacity-alert';

export async function getPriceSuggestion(input: SuggestPriceOnCapacityInput): Promise<SuggestPriceOnCapacityOutput> {
  try {
    const result = await suggestPriceOnCapacity(input);
    return result;
  } catch (error) {
    console.error("Error in getPriceSuggestion:", error);
    throw new Error("Failed to get price suggestion from AI.");
  }
}

export async function getCapacityAlert(input: DynamicCapacityAlertInput): Promise<DynamicCapacityAlertOutput> {
  try {
    return await dynamicCapacityAlert(input);
  } catch (error) {
    console.error("Error in getCapacityAlert:", error);
    throw new Error("Failed to get capacity alert from AI.");
  }
}
