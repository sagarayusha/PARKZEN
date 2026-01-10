'use client';

import { useContext } from 'react';
import { ParkingContext } from '@/contexts/parking-context';

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
