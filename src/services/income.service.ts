import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Income, CreateIncomeDTO, IncomeFilters } from '../types/income.types';

// Collection reference
const incomesCollection = collection(db, 'incomes');

// Mock data
const mockIncomes = [
  { 
    id: '1', 
    projectName: 'Website Design', 
    amount: 1200, 
    incomeSource: 'Freelance',
    transactionDate: '2023-11-15',
    taxCategory: 'Business Income'
  },
  { 
    id: '2', 
    projectName: 'Logo Creation', 
    amount: 450, 
    incomeSource: 'Freelance',
    transactionDate: '2023-11-10',
    taxCategory: 'Business Income'
  },
  { 
    id: '3', 
    projectName: 'Consulting', 
    amount: 800, 
    incomeSource: 'Consulting',
    transactionDate: '2023-11-05',
    taxCategory: 'Self-Employment'
  },
];

// Add a new income
export const addIncome = async (incomeData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Date.now().toString();
      mockIncomes.push({
        id: newId,
        ...incomeData
      });
      resolve(newId);
    }, 500);
  });
};

// Get all incomes
export const getIncomes = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockIncomes]);
    }, 500);
  });
};

// Update an income
export const updateIncome = async (id, incomeData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockIncomes.findIndex(income => income.id === id);
      if (index !== -1) {
        mockIncomes[index] = {
          ...mockIncomes[index],
          ...incomeData
        };
      }
      resolve(true);
    }, 500);
  });
};

// Delete an income
export const deleteIncome = async (id) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockIncomes.findIndex(income => income.id === id);
      if (index !== -1) {
        mockIncomes.splice(index, 1);
      }
      resolve(true);
    }, 500);
  });
};

// Get income statistics
export const getIncomeStats = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalIncome = mockIncomes.reduce((sum, income) => sum + income.amount, 0);
      
      const incomeBySource = mockIncomes.reduce((acc, income) => {
        const source = income.incomeSource || 'Other';
        if (!acc[source]) {
          acc[source] = 0;
        }
        acc[source] += income.amount;
        return acc;
      }, {});
      
      resolve({
        totalIncome,
        incomeBySource
      });
    }, 500);
  });
};

export const incomeService = {
  async createIncome(userId: string, incomeData: CreateIncomeDTO): Promise<Income> {
    const timestamp = new Date();
    const newIncome = {
      ...incomeData,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const docRef = await addDoc(incomesCollection, newIncome);

    return {
      id: docRef.id,
      ...newIncome
    };
  },

  async getIncomes(userId: string, filters?: IncomeFilters): Promise<Income[]> {
    let query = query(
      incomesCollection,
      where('userId', '==', userId),
      orderBy('transactionDate', 'desc')
    );

    if (filters?.startDate) {
      query = query(
        query,
        where('transactionDate', '>=', filters.startDate)
      );
    }
    if (filters?.endDate) {
      query = query(
        query,
        where('transactionDate', '<=', filters.endDate)
      );
    }
    if (filters?.incomeSource) {
      query = query(
        query,
        where('incomeSource', '==', filters.incomeSource)
      );
    }
    if (filters?.projectName) {
      query = query(
        query,
        where('projectName', '==', filters.projectName)
      );
    }
    if (filters?.taxCategory) {
      query = query(
        query,
        where('taxCategory', '==', filters.taxCategory)
      );
    }

    const querySnapshot = await getDocs(query);
    const incomes = [];
    
    querySnapshot.forEach((doc) => {
      incomes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return incomes;
  },

  async updateIncome(id: string, updates: Partial<Income>): Promise<void> {
    await updateDoc(doc(db, 'incomes', id), {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteIncome(id: string): Promise<void> {
    await deleteDoc(doc(db, 'incomes', id));
  },

  async getIncomeStats(userId: string, startDate: Date, endDate: Date) {
    const incomes = await this.getIncomes(userId, { startDate, endDate });
    
    return {
      totalIncome: incomes.reduce((sum, income) => sum + income.amount, 0),
      bySource: incomes.reduce((acc, income) => ({
        ...acc,
        [income.incomeSource]: (acc[income.incomeSource] || 0) + income.amount
      }), {}),
      byTaxCategory: incomes.reduce((acc, income) => ({
        ...acc,
        [income.taxCategory]: (acc[income.taxCategory] || 0) + income.amount
      }), {})
    };
  }
}; 