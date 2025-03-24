import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://mzjtokatolreshwfwgnh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16anRva2F0b2xyZXNod2Z3Z25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzU0NzMsImV4cCI6MjA1ODI1MTQ3M30.OmPONDxVzqdmkMHuv_1wsCdocCwEyLBFENMKwOisyVY';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Authentication functions
export const signUp = async (email, password, displayName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'creativecash://reset-password',
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resetting password:', error.message);
    throw error;
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
};

// Income related functions
export const fetchIncomeData = async (userId) => {
  try {
    console.log('Fetching income data for user:', userId);
    
    if (!userId) {
      console.error('No user ID provided to fetchIncomeData');
      return [];
    }
    
    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Supabase error fetching income:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} income records`);
    return data || [];
  } catch (error) {
    console.error('Error fetching income data:', error.message);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

export const addIncome = async (incomeData) => {
  try {
    const { data, error } = await supabase
      .from('income')
      .insert([incomeData]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding income:', error.message);
    throw error;
  }
};

export const updateIncome = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('income')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating income:', error.message);
    throw error;
  }
};

export const deleteIncome = async (id) => {
  try {
    const { error } = await supabase
      .from('income')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting income:', error.message);
    throw error;
  }
};

// Client related functions
export const fetchClients = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    throw error;
  }
};

export const addClient = async (clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding client:', error.message);
    throw error;
  }
};

export const updateClient = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating client:', error.message);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting client:', error.message);
    throw error;
  }
};

// Invoice related functions
export const fetchInvoices = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
    throw error;
  }
};

export const addInvoice = async (invoiceData) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding invoice:', error.message);
    throw error;
  }
}; 