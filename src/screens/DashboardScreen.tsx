import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Icon } from 'react-native-elements';
import { useAuth } from '../hooks/useAuth';
import { incomeService } from '../services/income.service';
import { formatCurrency } from '../utils/formatters';

export const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    recentTransactions: [],
    incomeBySource: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get current year's data
      const startDate = new Date(new Date().getFullYear(), 0, 1);
      const endDate = new Date();
      
      // Get income statistics
      const stats = await incomeService.getIncomeStats(user.id, startDate, endDate);
      
      // Get recent transactions
      const incomes = await incomeService.getIncomes(user.id);
      const recentIncomes = incomes.slice(0, 5); // Get 5 most recent
      
      setDashboardData({
        totalIncome: stats.totalIncome,
        recentTransactions: recentIncomes,
        incomeBySource: stats.bySource
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecentTransactions = () => {
    if (dashboardData.recentTransactions.length === 0) {
      return (
        <Text style={styles.emptyText}>No recent transactions</Text>
      );
    }

    return dashboardData.recentTransactions.map((income) => (
      <TouchableOpacity 
        key={income.id} 
        style={styles.transactionItem}
        onPress={() => navigation.navigate('EditIncome', { income })}
      >
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionName}>{income.projectName}</Text>
          <Text style={styles.transactionDate}>
            {new Date(income.transactionDate).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.transactionAmount}>
          {formatCurrency(income.amount)}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text h3>Welcome, {user?.firstName || 'User'}</Text>
        <Button
          icon={<Icon name="logout" color="#fff" />}
          onPress={logout}
          type="clear"
        />
      </View>

      <Card containerStyle={styles.summaryCard}>
        <Card.Title>Year to Date Income</Card.Title>
        <Text style={styles.totalIncome}>
          {formatCurrency(dashboardData.totalIncome)}
        </Text>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title="Add Income"
          icon={<Icon name="add" color="#fff" size={15} />}
          onPress={() => navigation.navigate('AddIncome')}
          containerStyle={styles.actionButton}
        />
        <Button
          title="View All"
          icon={<Icon name="list" color="#fff" size={15} />}
          onPress={() => navigation.navigate('IncomeList')}
          containerStyle={styles.actionButton}
        />
      </View>

      <Card containerStyle={styles.transactionsCard}>
        <Card.Title>Recent Transactions</Card.Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          renderRecentTransactions()
        )}
      </Card>

      <Card containerStyle={styles.quickLinksCard}>
        <Card.Title>Quick Links</Card.Title>
        <View style={styles.quickLinks}>
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="person" size={30} />
            <Text style={styles.quickLinkText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => navigation.navigate('CategoryManagement')}
          >
            <Icon name="category" size={30} />
            <Text style={styles.quickLinkText}>Categories</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => navigation.navigate('IncomeVisualization')}
          >
            <Icon name="bar-chart" size={30} />
            <Text style={styles.quickLinkText}>Visualize</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => navigation.navigate('FinancialReports')}
          >
            <Icon name="receipt" size={30} />
            <Text style={styles.quickLinkText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  summaryCard: {
    borderRadius: 10,
    marginHorizontal: 15,
  },
  totalIncome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ecc71',
    textAlign: 'center',
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  transactionsCard: {
    borderRadius: 10,
    marginHorizontal: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  quickLinksCard: {
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickLink: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  quickLinkText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DashboardScreen; 