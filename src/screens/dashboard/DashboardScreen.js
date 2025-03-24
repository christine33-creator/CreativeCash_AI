import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../contexts/AuthContext';
import { fetchIncomeData } from '../../services/supabase';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Add a listener for when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    
    // Initial load
    loadDashboardData();
    
    // Clean up the listener when component unmounts
    return unsubscribe;
  }, [navigation]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If user is not logged in, show empty state
      if (!user) {
        setTotalIncome(0);
        setRecentTransactions([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch income data from Supabase
      const incomeData = await fetchIncomeData(user.id);
      
      // Handle case where incomeData might be null or undefined
      if (!incomeData || !Array.isArray(incomeData)) {
        console.log('No income data available or invalid format');
        setTotalIncome(0);
        setRecentTransactions([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`Fetched ${incomeData.length} income records`);
      
      // Calculate total income for the current month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthlyIncome = incomeData.filter(item => {
        if (!item.date) return false;
        try {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        } catch (e) {
          console.error('Error parsing date:', e);
          return false;
        }
      });
      
      const total = monthlyIncome.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      setTotalIncome(total);
      
      // Get recent transactions (last 5)
      const recent = [...incomeData]
        .sort((a, b) => {
          try {
            return new Date(b.date || 0) - new Date(a.date || 0);
          } catch (e) {
            return 0;
          }
        })
        .slice(0, 5);
      
      setRecentTransactions(recent);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadDashboardData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.user_metadata?.display_name || 'Creative Pro'}!</Text>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Income</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>
        <View style={styles.summaryFooter}>
          <Text style={styles.summaryPeriod}>This Month</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Income')}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddIncome')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle" size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Add Income</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('InvoiceGenerator')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="document-text" size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>Create Invoice</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AIChat')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="chatbubble-ellipses" size={24} color={colors.white} />
            </View>
            <Text style={styles.actionText}>AI Assistant</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentTransactionsCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Income')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionName}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
              <Text style={styles.transactionAmount}>{formatCurrency(transaction.amount)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyText}>No recent transactions</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddIncome')}
            >
              <Text style={styles.addButtonText}>Add Income</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.aiInsightsContainer}>
        <View style={styles.aiInsightsHeader}>
          <Text style={styles.sectionTitle}>AI Financial Insights</Text>
        </View>
        <TouchableOpacity 
          style={styles.aiInsightsCard}
          onPress={() => navigation.navigate('AIInsights')}
        >
          <View style={styles.aiInsightsIconContainer}>
            <Ionicons name="analytics" size={24} color={colors.white} />
          </View>
          <View style={styles.aiInsightsContent}>
            <Text style={styles.aiInsightsTitle}>Get Financial Insights</Text>
            <Text style={styles.aiInsightsDescription}>
              Tap here to get AI-powered analysis of your income patterns and financial health.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 10,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryPeriod: {
    fontSize: 14,
    color: colors.textLight,
  },
  viewDetailsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    marginTop: 0,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  recentTransactionsCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    marginTop: 0,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  emptyTransactions: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiInsightsContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  aiInsightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  aiInsightsCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiInsightsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  aiInsightsContent: {
    flex: 1,
  },
  aiInsightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  aiInsightsDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
}); 