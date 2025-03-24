import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { formatCurrency } from '../../utils/formatters';

interface IncomeStatsProps {
  totalIncome: number;
  bySource: Record<string, number>;
  byTaxCategory: Record<string, number>;
  periodLabel: string;
}

export const IncomeStats = ({ totalIncome, bySource, byTaxCategory, periodLabel }: IncomeStatsProps) => {
  const renderDistribution = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => {
        const percentage = ((value / total) * 100).toFixed(1);
        return (
          <View key={key} style={styles.distributionRow}>
            <Text style={styles.distributionLabel}>{key}</Text>
            <View style={styles.distributionValues}>
              <Text style={styles.distributionAmount}>{formatCurrency(value)}</Text>
              <Text style={styles.distributionPercentage}>{percentage}%</Text>
            </View>
          </View>
        );
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title>{periodLabel} Summary</Card.Title>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Income</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalIncome)}</Text>
        </View>
      </Card>

      <Card>
        <Card.Title>Income by Source</Card.Title>
        {renderDistribution(bySource)}
      </Card>

      <Card>
        <Card.Title>Income by Tax Category</Card.Title>
        {renderDistribution(byTaxCategory)}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  totalContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 5,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  distributionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  distributionValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  distributionPercentage: {
    fontSize: 14,
    color: '#666',
    width: 50,
    textAlign: 'right',
  },
}); 