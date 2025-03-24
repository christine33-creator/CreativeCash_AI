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
    
    setIsLoading(true);
    
    try {
      const data = await fetchIncomeData(user.id);
      setIncomeData(data);
      
      // Calculate total income
      const total = data.reduce((sum, item) => sum + item.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error('Error loading income data:', error);
      Alert.alert('Error', 'Failed to load income data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddIncome = () => {
    navigation.navigate('AddIncome');
  };
  
  const handleEditIncome = (item) => {
    navigation.navigate('EditIncome', { income: item });
  };
  
  const handleDeleteIncome = async (id) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteIncome(id);
              
              // Update local state
              const updatedIncome = incomeData.filter(item => item.id !== id);
              setIncomeData(updatedIncome);
              
              // Recalculate total
              const newTotal = updatedIncome.reduce((sum, item) => sum + item.amount, 0);
              setTotalIncome(newTotal);
            } catch (error) {
              console.error('Error deleting income:', error);
              Alert.alert('Error', 'Failed to delete income entry. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const renderIncomeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.incomeItem}
      onPress={() => handleEditIncome(item)}
    >
      <View style={styles.incomeInfo}>
        <Text style={styles.incomeTitle}>{item.title}</Text>
        <Text style={styles.incomeClient}>{item.client}</Text>
        <Text style={styles.incomeDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.incomeRight}>
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
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading income data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Income</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddIncome}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>Total Income</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>
      </View>
      
      {incomeData.length > 0 ? (
        <FlatList
          data={incomeData}
          renderItem={renderIncomeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cash-outline" size={60} color={colors.textLight} />
          <Text style={styles.emptyStateTitle}>No Income Entries</Text>
          <Text style={styles.emptyStateText}>
            Start tracking your income by adding your first entry.
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={handleAddIncome}
          >
            <Text style={styles.emptyStateButtonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
  summaryContainer: {
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 15,
    marginTop: -20,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
  },
  listContainer: {
    padding: 15,
  },
  incomeItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  incomeClient: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  incomeDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  incomeRight: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 30,
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