import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../styles/colors';

export default function TaxReportScreen({ navigation }) {
  const [year, setYear] = useState('2023');
  const [quarter, setQuarter] = useState('All');
  
  // Sample data
  const taxCategories = [
    { category: 'Business Income', amount: 7500 },
    { category: 'Self-Employment', amount: 2800 },
    { category: 'Royalties', amount: 800 },
    { category: 'Commission', amount: 1200 },
    { category: 'Other', amount: 350 },
  ];
  
  const totalIncome = taxCategories.reduce((sum, item) => sum + item.amount, 0);
  
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tax Report</Text>
      </View>
      
      <View style={styles.filterSection}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Year</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={year}
              onValueChange={(itemValue) => setYear(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="2023" value="2023" />
              <Picker.Item label="2022" value="2022" />
              <Picker.Item label="2021" value="2021" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Quarter</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={quarter}
              onValueChange={(itemValue) => setQuarter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Q1 (Jan-Mar)" value="Q1" />
              <Picker.Item label="Q2 (Apr-Jun)" value="Q2" />
              <Picker.Item label="Q3 (Jul-Sep)" value="Q3" />
              <Picker.Item label="Q4 (Oct-Dec)" value="Q4" />
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Income Summary</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalIncome)}</Text>
        <Text style={styles.periodText}>
          {quarter === 'All' ? `Year ${year}` : `${quarter} ${year}`}
        </Text>
      </View>
      
      <View style={styles.categoriesCard}>
        <Text style={styles.cardTitle}>Income by Tax Category</Text>
        
        {taxCategories.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.category}</Text>
            <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Report Actions</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={22} color={colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Download PDF Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="mail-outline" size={22} color={colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Email Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
          <Ionicons name="share-outline" size={22} color={colors.white} style={styles.actionIcon} />
          <Text style={styles.actionText}>Share with Accountant</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.notesCard}>
        <Text style={styles.cardTitle}>Tax Notes</Text>
        <Text style={styles.noteText}>
          • Remember to keep all receipts and invoices for your records.
        </Text>
        <Text style={styles.noteText}>
          • Consult with a tax professional for specific advice on deductions.
        </Text>
        <Text style={styles.noteText}>
          • Estimated quarterly tax payments may be required if you expect to owe $1,000 or more.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  filterSection: {
    backgroundColor: colors.card,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
  },
  periodText: {
    fontSize: 16,
    color: colors.textLight,
  },
  categoriesCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryName: {
    fontSize: 16,
    color: colors.text,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  actionsCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
}); 