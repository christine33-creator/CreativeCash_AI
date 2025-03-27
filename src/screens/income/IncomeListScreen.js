import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { fetchIncomeData, deleteIncome } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function IncomeListScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [incomeData, setIncomeData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    // Add a listener for when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadIncomeData();
    });
    
    // Initial load
    loadIncomeData();
    
    // Clean up the listener when component unmounts
    return unsubscribe;
  }, [navigation]);
  
  const loadIncomeData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching income data for user:', user.id);
      
      const data = await fetchIncomeData(user.id);
      console.log(`Fetched ${data.length} income records`);
      
      setIncomeData(data);
      
      // Calculate total income
      const total = data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      setTotalIncome(total);
    } catch (error) {
      console.error('Error loading income data:', error);
      Alert.alert('Error', 'Failed to load income data. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadIncomeData();
  };
  
  const handleDeleteIncome = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this income entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteIncome(id);
              
              // Update the local state
              setIncomeData(prevData => {
                const newData = prevData.filter(item => item.id !== id);
                
                // Recalculate total
                const newTotal = newData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
                setTotalIncome(newTotal);
                
                return newData;
              });
              
              Alert.alert('Success', 'Income entry deleted successfully');
            } catch (error) {
              console.error('Error deleting income:', error);
              Alert.alert('Error', 'Failed to delete income entry. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const renderIncomeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.incomeItem}
      onPress={() => navigation.navigate('EditIncome', { income: item })}
    >
      <View style={styles.incomeDetails}>
        <Text style={styles.incomeTitle}>{item.title}</Text>
        <Text style={styles.incomeDate}>{formatDate(item.date)}</Text>
        <Text style={styles.incomeClient}>{item.client || 'No client'}</Text>
      </View>
      <View style={styles.incomeActions}>
        <Text style={styles.incomeAmount}>{formatCurrency(item.amount)}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteIncome(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cash-outline" size={80} color={colors.textLight} />
      <Text style={styles.emptyStateTitle}>No Income Entries Yet</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your income by adding your first entry.
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('AddIncome')}
      >
        <Text style={styles.emptyStateButtonText}>Add Income</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Income</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddIncome')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Income</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalIncome)}</Text>
      </View>
      
      {isLoading && incomeData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading income data...</Text>
        </View>
      ) : (
        <FlatList
          data={incomeData}
          renderItem={renderIncomeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeDetails: {
    flex: 1,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  incomeDate: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 3,
  },
  incomeClient: {
    fontSize: 14,
    color: colors.textLight,
  },
  incomeActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 10,
  },
  deleteButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 