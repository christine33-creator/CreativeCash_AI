import { supabase } from './supabase';

// Get all income entries for a user
export const getIncomeEntries = async (userId) => {
  const { data, error } = await supabase
    .from('income_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  return { data, error };
};

// Add a new income entry
export const addIncomeEntry = async (entry) => {
  const { data, error } = await supabase
    .from('income_entries')
    .insert([entry])
    .select();
  
  return { data, error };
};

// Update an existing income entry
export const updateIncomeEntry = async (id, updates) => {
  const { data, error } = await supabase
    .from('income_entries')
    .update(updates)
    .eq('id', id)
    .select();
  
  return { data, error };
};

// Delete an income entry
export const deleteIncomeEntry = async (id) => {
  const { error } = await supabase
    .from('income_entries')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Get income statistics
export const getIncomeStats = async (userId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('income_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);
  
  if (error) return { error };
  
  // Calculate statistics
  const totalIncome = data.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Group by source
  const bySource = data.reduce((acc, entry) => {
    acc[entry.source] = (acc[entry.source] || 0) + entry.amount;
    return acc;
  }, {});
  
  // Group by tax category
  const byTaxCategory = data.reduce((acc, entry) => {
    acc[entry.tax_category] = (acc[entry.tax_category] || 0) + entry.amount;
    return acc;
  }, {});
  
  return { 
    data: {
      totalIncome,
      bySource,
      byTaxCategory
    }
  };
}; 