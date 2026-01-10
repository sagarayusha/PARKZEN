'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { ParkingLot, ParkingSession } from '@/lib/types';
import { mockParkingLots, mockParkingSessions } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';

interface ParkingContextType {
  parkingLots: ParkingLot[];
  userSessions: ParkingSession[];
  activeSession: ParkingSession | null;
  checkIn: (lotId: string, vehicleNumber: string) => { success: boolean, message: string };
  checkOut: (sessionId: string) => { success: boolean, message: string };
  getLotById: (lotId: string) => ParkingLot | undefined;
}

export const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(mockParkingLots);
  const [sessions, setSessions] = useState<ParkingSession[]>(mockParkingSessions);
  const [userSessions, setUserSessions] = useState<ParkingSession[]>([]);
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);

  useEffect(() => {
    if (user) {
      const filteredSessions = sessions.filter(s => s.userId === user.id);
      setUserSessions(filteredSessions);
      const currentActive = filteredSessions.find(s => !s.checkOutTime) || null;
      setActiveSession(currentActive);
    } else {
      setUserSessions([]);
      setActiveSession(null);
    }
  }, [user, sessions]);

  const getLotById = (lotId: string) => {
    return parkingLots.find(lot => lot.id === lotId);
  }

  const checkIn = (lotId: string, vehicleNumber: string): { success: boolean, message: string } => {
    if (!user) return { success: false, message: 'User not authenticated.' };
    if (activeSession) return { success: false, message: 'User already has an active session.' };

    const lot = parkingLots.find(l => l.id === lotId);
    if (!lot) return { success: false, message: 'Parking lot not found.' };

    if (lot.currentOccupancy >= lot.capacity) {
      return { success: false, message: 'Parking lot is full.' };
    }

    const newSession: ParkingSession = {
      id: `session-${Date.now()}`,
      userId: user.id,
      parkingLotId: lotId,
      checkInTime: new Date(),
      vehicleNumber,
    };

    setSessions(prev => [...prev, newSession]);
    setParkingLots(prevLots => 
      prevLots.map(l => 
        l.id === lotId ? { ...l, currentOccupancy: l.currentOccupancy + 1 } : l
      )
    );

    return { success: true, message: 'Check-in successful.' };
  };

  const checkOut = (sessionId: string): { success: boolean, message: string } => {
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return { success: false, message: 'Session not found.' };

    const session = sessions[sessionIndex];
    const lot = parkingLots.find(l => l.id === session.parkingLotId);
    if (!lot) return { success: false, message: 'Parking lot not found.' };
    
    const durationHours = (new Date().getTime() - session.checkInTime.getTime()) / (1000 * 60 * 60);
    const cost = Math.ceil(durationHours * lot.basePrice);

    setSessions(prev =>
      prev.map(s => 
        s.id === sessionId ? { ...s, checkOutTime: new Date(), cost } : s
      )
    );

    setParkingLots(prevLots => 
      prevLots.map(l => 
        l.id === session.parkingLotId ? { ...l, currentOccupancy: Math.max(0, l.currentOccupancy - 1) } : l
      )
    );
    
    return { success: true, message: 'Check-out successful.' };
  };

  return (
    <ParkingContext.Provider value={{ parkingLots, userSessions, activeSession, checkIn, checkOut, getLotById }}>
      {children}
    </ParkingContext.Provider>
  );
};
