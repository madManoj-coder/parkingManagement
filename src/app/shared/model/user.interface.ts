






export interface Slot {
  slot: string;         
  isActive: boolean;    
  vehicleNumber?: string | null; 
  vehicleType : 'bike' | 'car';
  id ?: string;
}
