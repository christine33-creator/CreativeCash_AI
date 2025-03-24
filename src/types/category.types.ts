export interface IncomeCategory {
  id: string;
  userId: string;
  name: string;
  type: 'source' | 'tax';
  color?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncomeCategoryDTO {
  name: string;
  type: 'source' | 'tax';
  color?: string;
  description?: string;
} 