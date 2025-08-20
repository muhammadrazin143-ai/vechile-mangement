export type VehicleStatus = 'Available' | 'Sold' | 'Pending' | 'Workshop';

export interface Vehicle {
  id: string;
  brandModel: string;
  vehicleNumber: string;
  
  purchaseDate: string;
  purchasePrice: number;
  sellerName: string;
  sellerContact: string;
  sellerPlace: string;
  sellerAddress?: string;
  purchaseBill?: string;
  purchaseBalance?: number;
  isPartnership?: boolean;
  partnerName?: string;
  
  saleDate?: string;
  sellingPrice?: number;
  buyerName?: string;
  buyerContact?: string;
  buyerPlace?: string;
  buyerAddress?: string;
  saleBill?: string;
  saleBalance?: number;
  financierName?: string;
  financierAmount?: number;
  financeCreditedDate?: string;
  
  status: VehicleStatus;
  notes?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  amount: number;
  description?: string;
  date: string;
}

export interface NavItemType {
  name: string;
  path: string;
  icon: (props: { className: string }) => React.ReactNode;
  disabled?: boolean;
}

export interface SearchResult {
  type: VehicleStatus;
  data: Vehicle;
  path: string;
}