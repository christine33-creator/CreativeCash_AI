import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Input, ListItem, Icon, FAB } from 'react-native-elements';
import { useAuth } from '../../hooks/useAuth';
import { categoryService } from '../../services/category.service';
import { IncomeCategory } from '../../types/category.types';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const CategoryManagementScreen = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategory | null>(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'source' | 'tax'>('source');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories(user!.id);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await categoryService.createCategory(user!.id, {
        name: newCategoryName.trim(),
        type: categoryType,
      });
      setNewCategoryName('');
      setIsAddModalVisible(false);
      loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await categoryService.deleteCategory(selectedCategory.id);
      setIsDeleteDialogVisible(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <Icon name={item.type === 'source' ? 'account-balance' : 'receipt'} />
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.type}</ListItem.Subtitle>
            </ListItem.Content>
            <Button
              icon={{ name: 'delete', color: '#ff4444' }}
              type="clear"
              onPress={() => {
                setSelectedCategory(item);
                setIsDeleteDialogVisible(true);
              }}
            />
          </ListItem>
        )}
        keyExtractor={item => item.id}
        refreshing={isLoading}
        onRefresh={loadCategories}
      />

      <FAB
        icon={{ name: 'add', color: 'white' }}
        placement="right"
        color="#2ecc71"
        onPress={() => setIsAddModalVisible(true)}
      />

      <ConfirmationDialog
        isVisible={isDeleteDialogVisible}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteCategory}
        onCancel={() => {
          setIsDeleteDialogVisible(false);
          setSelectedCategory(null);
        }}
        isDestructive
      />

      {/* Add Category Modal */}
      {/* ... Add modal implementation ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 