import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-price-on-capacity.ts';
import '@/ai/flows/dynamic-capacity-alert.ts';