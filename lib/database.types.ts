export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          brand_model: string
          vehicle_number: string
          purchase_date: string
          purchase_price: number
          seller_name: string
          seller_contact: string
          seller_place: string
          seller_address: string | null
          purchase_bill: string | null
          purchase_balance: number | null
          is_partnership: boolean | null
          partner_name: string | null
          sale_date: string | null
          selling_price: number | null
          buyer_name: string | null
          buyer_contact: string | null
          buyer_place: string | null
          buyer_address: string | null
          sale_bill: string | null
          sale_balance: number | null
          financier_name: string | null
          financier_amount: number | null
          finance_credited_date: string | null
          status: string
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          brand_model: string
          vehicle_number: string
          purchase_date: string
          purchase_price: number
          seller_name: string
          seller_contact: string
          seller_place: string
          seller_address?: string | null
          purchase_bill?: string | null
          purchase_balance?: number | null
          is_partnership?: boolean | null
          partner_name?: string | null
          sale_date?: string | null
          selling_price?: number | null
          buyer_name?: string | null
          buyer_contact?: string | null
          buyer_place?: string | null
          buyer_address?: string | null
          sale_bill?: string | null
          sale_balance?: number | null
          financier_name?: string | null
          financier_amount?: number | null
          finance_credited_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          brand_model?: string
          vehicle_number?: string
          purchase_date?: string
          purchase_price?: number
          seller_name?: string
          seller_contact?: string
          seller_place?: string
          seller_address?: string | null
          purchase_bill?: string | null
          purchase_balance?: number | null
          is_partnership?: boolean | null
          partner_name?: string | null
          sale_date?: string | null
          selling_price?: number | null
          buyer_name?: string | null
          buyer_contact?: string | null
          buyer_place?: string | null
          buyer_address?: string | null
          sale_bill?: string | null
          sale_balance?: number | null
          financier_name?: string | null
          financier_amount?: number | null
          finance_credited_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          vehicle_id: string
          amount: number
          description: string | null
          date: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          vehicle_id: string
          amount: number
          description?: string | null
          date: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          vehicle_id?: string
          amount?: number
          description?: string | null
          date?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}