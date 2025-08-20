import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';
import type { Database } from '../lib/database.types';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

// Convert database row to Vehicle type
const convertToVehicle = (row: VehicleRow): Vehicle => ({
  id: row.id,
  brandModel: row.brand_model,
  vehicleNumber: row.vehicle_number,
  purchaseDate: row.purchase_date,
  purchasePrice: row.purchase_price,
  sellerName: row.seller_name,
  sellerContact: row.seller_contact,
  sellerPlace: row.seller_place,
  sellerAddress: row.seller_address || undefined,
  purchaseBill: row.purchase_bill || undefined,
  purchaseBalance: row.purchase_balance || undefined,
  isPartnership: row.is_partnership || undefined,
  partnerName: row.partner_name || undefined,
  saleDate: row.sale_date || undefined,
  sellingPrice: row.selling_price || undefined,
  buyerName: row.buyer_name || undefined,
  buyerContact: row.buyer_contact || undefined,
  buyerPlace: row.buyer_place || undefined,
  buyerAddress: row.buyer_address || undefined,
  saleBill: row.sale_bill || undefined,
  saleBalance: row.sale_balance || undefined,
  financierName: row.financier_name || undefined,
  financierAmount: row.financier_amount || undefined,
  financeCreditedDate: row.finance_credited_date || undefined,
  status: row.status as Vehicle['status'],
  notes: row.notes || undefined,
});

// Convert Vehicle to database insert format
const convertToInsert = (vehicle: Omit<Vehicle, 'id' | 'status'>): VehicleInsert => ({
  brand_model: vehicle.brandModel,
  vehicle_number: vehicle.vehicleNumber,
  purchase_date: vehicle.purchaseDate,
  purchase_price: vehicle.purchasePrice,
  seller_name: vehicle.sellerName,
  seller_contact: vehicle.sellerContact,
  seller_place: vehicle.sellerPlace,
  seller_address: vehicle.sellerAddress || null,
  purchase_bill: vehicle.purchaseBill || null,
  purchase_balance: vehicle.purchaseBalance || null,
  is_partnership: vehicle.isPartnership || null,
  partner_name: vehicle.partnerName || null,
  sale_date: vehicle.saleDate || null,
  selling_price: vehicle.sellingPrice || null,
  buyer_name: vehicle.buyerName || null,
  buyer_contact: vehicle.buyerContact || null,
  buyer_place: vehicle.buyerPlace || null,
  buyer_address: vehicle.buyerAddress || null,
  sale_bill: vehicle.saleBill || null,
  sale_balance: vehicle.saleBalance || null,
  financier_name: vehicle.financierName || null,
  financier_amount: vehicle.financierAmount || null,
  finance_credited_date: vehicle.financeCreditedDate || null,
  status: 'Available',
  notes: vehicle.notes || null,
});

// Convert Vehicle to database update format
const convertToUpdate = (vehicle: Vehicle): VehicleUpdate => ({
  brand_model: vehicle.brandModel,
  vehicle_number: vehicle.vehicleNumber,
  purchase_date: vehicle.purchaseDate,
  purchase_price: vehicle.purchasePrice,
  seller_name: vehicle.sellerName,
  seller_contact: vehicle.sellerContact,
  seller_place: vehicle.sellerPlace,
  seller_address: vehicle.sellerAddress || null,
  purchase_bill: vehicle.purchaseBill || null,
  purchase_balance: vehicle.purchaseBalance || null,
  is_partnership: vehicle.isPartnership || null,
  partner_name: vehicle.partnerName || null,
  sale_date: vehicle.saleDate || null,
  selling_price: vehicle.sellingPrice || null,
  buyer_name: vehicle.buyerName || null,
  buyer_contact: vehicle.buyerContact || null,
  buyer_place: vehicle.buyerPlace || null,
  buyer_address: vehicle.buyerAddress || null,
  sale_bill: vehicle.saleBill || null,
  sale_balance: vehicle.saleBalance || null,
  financier_name: vehicle.financierName || null,
  financier_amount: vehicle.financierAmount || null,
  finance_credited_date: vehicle.financeCreditedDate || null,
  status: vehicle.status,
  notes: vehicle.notes || null,
});

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vehicles from database
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVehicles(data.map(convertToVehicle));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Add new vehicle
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert(convertToInsert(vehicleData))
        .select()
        .single();

      if (error) throw error;

      const newVehicle = convertToVehicle(data);
      setVehicles(prev => [newVehicle, ...prev]);
      return newVehicle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update vehicle
  const updateVehicle = async (vehicle: Vehicle) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(convertToUpdate(vehicle))
        .eq('id', vehicle.id)
        .select()
        .single();

      if (error) throw error;

      const updatedVehicle = convertToVehicle(data);
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? updatedVehicle : v));
      return updatedVehicle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete vehicle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  };
};