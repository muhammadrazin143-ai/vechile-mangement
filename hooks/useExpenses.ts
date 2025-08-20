import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Expense } from '../types';
import type { Database } from '../lib/database.types';

type ExpenseRow = Database['public']['Tables']['expenses']['Row'];
type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update'];

// Convert database row to Expense type
const convertToExpense = (row: ExpenseRow): Expense => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  amount: row.amount,
  description: row.description || undefined,
  date: row.date,
});

// Convert Expense to database insert format
const convertToInsert = (expense: Omit<Expense, 'id'>): ExpenseInsert => ({
  vehicle_id: expense.vehicleId,
  amount: expense.amount,
  description: expense.description || null,
  date: expense.date,
});

// Convert Expense to database update format
const convertToUpdate = (expense: Expense): ExpenseUpdate => ({
  vehicle_id: expense.vehicleId,
  amount: expense.amount,
  description: expense.description || null,
  date: expense.date,
});

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses from database
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setExpenses(data.map(convertToExpense));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  // Add new expense
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert(convertToInsert(expenseData))
        .select()
        .single();

      if (error) throw error;

      const newExpense = convertToExpense(data);
      setExpenses(prev => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update expense
  const updateExpense = async (expense: Expense) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(convertToUpdate(expense))
        .eq('id', expense.id)
        .select()
        .single();

      if (error) throw error;

      const updatedExpense = convertToExpense(data);
      setExpenses(prev => prev.map(e => e.id === expense.id ? updatedExpense : e));
      return updatedExpense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
};