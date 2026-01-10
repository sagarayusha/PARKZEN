'use server';

/**
 * @fileOverview An AI agent for alerting contractors and users when the parking lot is nearing capacity.
 *
 * - dynamicCapacityAlert - A function that triggers the alert process.
 * - DynamicCapacityAlertInput - The input type for the dynamicCapacityAlert function.
 * - DynamicCapacityAlertOutput - The return type for the dynamicCapacityAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DynamicCapacityAlertInputSchema = z.object({
  currentCapacity: z
    .number()
    .describe('The current capacity of the parking lot.'),
  maxCapacity: z.number().describe('The maximum capacity of the parking lot.'),
  notificationThreshold: z
    .number()
    .describe(
      'The percentage of capacity at which to send a notification (e.g., 0.8 for 80%).'
    ),
  parkingLotName: z.string().describe('The name of the parking lot.'),
});
export type DynamicCapacityAlertInput = z.infer<typeof DynamicCapacityAlertInputSchema>;

const DynamicCapacityAlertOutputSchema = z.object({
  alertMessage: z
    .string()
    .describe(
      'A message to send to contractors and users indicating the parking lot is nearing capacity.'
    ),
  shouldSendAlert: z
    .boolean()
    .describe(
      'A boolean indicating whether or not an alert should be sent based on the current capacity.'
    ),
});
export type DynamicCapacityAlertOutput = z.infer<typeof DynamicCapacityAlertOutputSchema>;

export async function dynamicCapacityAlert(
  input: DynamicCapacityAlertInput
): Promise<DynamicCapacityAlertOutput> {
  return dynamicCapacityAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicCapacityAlertPrompt',
  input: {schema: DynamicCapacityAlertInputSchema},
  output: {schema: DynamicCapacityAlertOutputSchema},
  prompt: `You are an AI assistant helping to manage parking lot capacity.

  You will receive the current capacity, maximum capacity, and a notification threshold.
  Your job is to determine if an alert message should be sent to contractors and users.

  Current Capacity: {{{currentCapacity}}}
  Maximum Capacity: {{{maxCapacity}}}
  Notification Threshold: {{{notificationThreshold}}}
  Parking Lot Name: {{{parkingLotName}}}

  If the current capacity exceeds the notification threshold (e.g., currentCapacity / maxCapacity > notificationThreshold), you should set shouldSendAlert to true and generate an alert message informing contractors and users that the parking lot is nearing capacity. Make the alert message friendly and informative.

  If the current capacity does not exceed the notification threshold, set shouldSendAlert to false and provide an empty alert message.
  `,
});

const dynamicCapacityAlertFlow = ai.defineFlow(
  {
    name: 'dynamicCapacityAlertFlow',
    inputSchema: DynamicCapacityAlertInputSchema,
    outputSchema: DynamicCapacityAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
