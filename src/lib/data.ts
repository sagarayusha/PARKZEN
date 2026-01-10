import type { User, ParkingLot, ParkingSession } from './types';
import { PlaceHolderImages } from './placeholder-images';

const userAvatars = PlaceHolderImages.filter(img => img.id.includes('user-avatar')).map(img => img.imageUrl);

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alex Doe', email: 'citizen@smartpark.com', role: 'citizen', avatarUrl: userAvatars[0] || '' },
  { id: 'user-2', name: 'Jane Smith', email: 'official@smartpark.com', role: 'official', avatarUrl: userAvatars[1] || '' },
  { id: 'user-3', name: 'Contractor Sam', email: 'contractor@smartpark.com', role: 'contractor', avatarUrl: userAvatars[2] || '' },
  { id: 'user-4', name: 'Bob Johnson', email: 'bob@example.com', role: 'citizen', avatarUrl: userAvatars[3] || '' },
];

const generateHistoricalData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
        data.push({
            timestamp: `2023-10-27T${String(i).padStart(2, '0')}:00:00`,
            occupancy: Math.floor(Math.random() * 80) + 10, // Random occupancy between 10 and 90
        });
    }
    return JSON.stringify(data);
}

export const mockParkingLots: ParkingLot[] = [
  {
    id: 'lot-1',
    name: 'Connaught Place Lot A',
    address: 'Inner Circle, New Delhi',
    location: { lat: 28.6324, lng: 77.2187 },
    capacity: 100,
    currentOccupancy: 85,
    basePrice: 50,
    historicalData: [
      { timestamp: '10:00', occupancy: 60 }, { timestamp: '11:00', occupancy: 75 },
      { timestamp: '12:00', occupancy: 90 }, { timestamp: '13:00', occupancy: 88 },
    ],
  },
  {
    id: 'lot-2',
    name: 'Khan Market Lot',
    address: 'Khan Market, New Delhi',
    location: { lat: 28.6001, lng: 77.2274 },
    capacity: 75,
    currentOccupancy: 50,
    basePrice: 60,
    historicalData: [
      { timestamp: '17:00', occupancy: 65 }, { timestamp: '18:00', occupancy: 72 },
      { timestamp: '19:00', occupancy: 74 }, { timestamp: '20:00', occupancy: 70 },
    ],
  },
  {
    id: 'lot-3',
    name: 'South Extension Lot B',
    address: 'South Ex, Part-II, New Delhi',
    location: { lat: 28.5679, lng: 77.2233 },
    capacity: 120,
    currentOccupancy: 118,
    basePrice: 45,
    historicalData: [
      { timestamp: '14:00', occupancy: 80 }, { timestamp: '15:00', occupancy: 95 },
      { timestamp: '16:00', occupancy: 110 }, { timestamp: '17:00', occupancy: 115 },
    ],
  },
  {
    id: 'lot-4',
    name: 'Nehru Place Tech Park',
    address: 'Nehru Place, New Delhi',
    location: { lat: 28.5485, lng: 77.2526 },
    capacity: 200,
    currentOccupancy: 90,
    basePrice: 40,
    historicalData: [
      { timestamp: '09:00', occupancy: 150 }, { timestamp: '10:00', occupancy: 180 },
      { timestamp: '11:00', occupancy: 190 }, { timestamp: '12:00', occupancy: 185 },
    ],
  },
];

export const mockParkingSessions: ParkingSession[] = [
    {
        id: 'session-1',
        userId: 'user-1',
        parkingLotId: 'lot-1',
        checkInTime: new Date(new Date().setHours(new Date().getHours() - 2)),
        vehicleNumber: 'DL1AB1234',
    },
    {
        id: 'session-2',
        userId: 'user-1',
        parkingLotId: 'lot-2',
        checkInTime: new Date('2023-10-26T10:00:00'),
        checkOutTime: new Date('2023-10-26T12:30:00'),
        vehicleNumber: 'DL1AB1234',
        cost: 150,
    },
     {
        id: 'session-3',
        userId: 'user-4',
        parkingLotId: 'lot-4',
        checkInTime: new Date(new Date().setHours(new Date().getHours() - 1)),
        vehicleNumber: 'HR26CD5678',
    },
    {
        id: 'session-4',
        userId: 'user-1',
        parkingLotId: 'lot-3',
        checkInTime: new Date('2023-10-25T18:00:00'),
        checkOutTime: new Date('2023-10-25T20:00:00'),
        vehicleNumber: 'DL1AB1234',
        cost: 90,
    },
];
