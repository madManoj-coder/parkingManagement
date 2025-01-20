






export interface Slot {
  slotId: string;         // Unique identifier (e.g., A1, B2, C3, etc.)
  isOccupied: boolean;    // Whether the slot is occupied or not
  vehicleNumber?: string | null; // Vehicle number, if occupied
  vehicleType : 'bike' | 'car'
}
