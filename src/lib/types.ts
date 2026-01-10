export type User = {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'official' | 'contractor';
  avatarUrl: string;
};

export type ParkingLot = {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  currentOccupancy: number;
  basePrice: number;
  historicalData: HistoricalData[];
};

export type ParkingSession = {
  id: string;
  userId: string;
  parkingLotId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  vehicleNumber: string;
  cost?: number;
};

export type HistoricalData = {
  timestamp: string;
  occupancy: number;
};
