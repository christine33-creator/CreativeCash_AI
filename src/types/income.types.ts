export interface Income {
  id: string;
  userId: string;
  projectName: string;
  incomeSource: string;
  amount: number;
  paymentMethod: string;
  transactionDate: Date;
  notes?: string;
  taxCategory: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncomeDTO {
  projectName: string;
  incomeSource: string;
  amount: number;
  paymentMethod: string;
  transactionDate: Date;
  notes?: string;
  taxCategory: string;
}

export interface IncomeFilters {
  startDate?: Date;
  endDate?: Date;
  incomeSource?: string;
  projectName?: string;
  taxCategory?: string;
}

export const INCOME_SOURCES = [
  'Freelance',
  'Consulting',
  'Art Sales',
  'Digital Products',
  'Workshops',
  'Other'
];

export const PAYMENT_METHODS = [
  'Bank Transfer',
  'PayPal',
  'Credit Card',
  'Cash',
  'Crypto',
  'Other'
];

export const TAX_CATEGORIES = [
  'Business Income',
  'Self-Employment',
  'Royalties',
  'Commission',
  'Other'
]; 