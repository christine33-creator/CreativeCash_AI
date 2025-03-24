import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { Income } from '../../types/income.types';
import { formatCurrency } from '../../utils/formatters';

interface IncomeListItemProps {
  income: Income;
  onPress: (income: Income) => void;
}

export const IncomeListItem = ({ income, onPress }: IncomeListItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(income)}
    >
      <View style={styles.mainContent}>
        <Text h4 style={styles.projectName}>{income.projectName}</Text>
        <Text style={styles.amount}>{formatCurrency(income.amount)}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Icon name="account-balance" size={16} color="#666" />
          <Text style={styles.detailText}>{income.incomeSource}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="date-range" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(income.transactionDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="receipt" size={16} color="#666" />
          <Text style={styles.detailText}>{income.taxCategory}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectName: {
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
}); 