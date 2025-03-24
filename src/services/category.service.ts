import firestore from '@react-native-firebase/firestore';
import { IncomeCategory, CreateIncomeCategoryDTO } from '../types/category.types';

export const categoryService = {
  async createCategory(userId: string, categoryData: CreateIncomeCategoryDTO): Promise<IncomeCategory> {
    const timestamp = new Date();
    const newCategory = {
      ...categoryData,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await firestore()
      .collection('incomeCategories')
      .add(newCategory);

    return {
      id: docRef.id,
      ...newCategory,
    };
  },

  async getCategories(userId: string, type?: 'source' | 'tax'): Promise<IncomeCategory[]> {
    let query = firestore()
      .collection('incomeCategories')
      .where('userId', '==', userId);

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as IncomeCategory));
  },

  async updateCategory(id: string, updates: Partial<IncomeCategory>): Promise<void> {
    await firestore()
      .collection('incomeCategories')
      .doc(id)
      .update({
        ...updates,
        updatedAt: new Date(),
      });
  },

  async deleteCategory(id: string): Promise<void> {
    await firestore()
      .collection('incomeCategories')
      .doc(id)
      .delete();
  },
}; 