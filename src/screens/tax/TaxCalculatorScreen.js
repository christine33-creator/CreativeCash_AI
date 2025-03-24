import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateTaxes } from '../../services/taxService';

export default function TaxCalculatorScreen({ navigation }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Tax inputs
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Tax results
  const [taxResults, setTaxResults] = useState(null);
  
  // User tax settings
  const [taxSettings, setTaxSettings] = useState({
    country: 'US',
    state: '',
    businessType: 'sole_prop',
    filingStatus: 'single',
    dependents: 0
  });

  useEffect(() => {
    // In a real app, you would fetch the user's tax settings from your backend
    // For now, we'll simulate loading
    setTimeout(() => {
      // Mock data
      setTaxSettings({
        country: 'US',
        state: 'CA',
        businessType: 'sole_prop',
        filingStatus: 'single',
        dependents: 0
      });
      setIncome('75000');
      setExpenses('15000');
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCalculate = async () => {
    if (!income || isNaN(parseFloat(income))) {
      Alert.alert('Error', 'Please enter a valid income amount');
      return;
    }

    if (!expenses || isNaN(parseFloat(expenses))) {
      Alert.alert('Error', 'Please enter a valid expenses amount');
      return;
    }

    try {
      setIsCalculating(true);
      
      const incomeValue = parseFloat(income);
      const expensesValue = parseFloat(expenses);
      const yearValue = parseInt(year);
      
      // Calculate taxes using our tax service
      const results = await calculateTaxes({
        income: incomeValue,
        expenses: expensesValue,
        year: yearValue,
        country: taxSettings.country,
        state: taxSettings.state,
        businessType: taxSettings.businessType,
        filingStatus: taxSettings.filingStatus,
        dependents: taxSettings.dependents
      });
      
      setTaxResults(results);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to calculate taxes');
    } finally {
      setIsCalculating(false);
    }
  };

  const renderTaxResults = () => {
    if (!taxResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Tax Estimate Results</Text>
        
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>Income Summary</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Gross Income</Text>
            <Text style={styles.resultValue}>{formatCurrency(taxResults.grossIncome)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Business Expenses</Text>
            <Text style={styles.resultValue}>-{formatCurrency(taxResults.expenses)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Net Business Income</Text>
            <Text style={styles.resultValue}>{formatCurrency(taxResults.netBusinessIncome)}</Text>
          </View>
        </View>
        
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>Federal Taxes</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Self-Employment Tax</Text>
            <Text style={styles.resultValue}>{formatCurrency(taxResults.selfEmploymentTax)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Income Tax</Text>
            <Text style={styles.resultValue}>{formatCurrency(taxResults.federalIncomeTax)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Federal Tax</Text>
            <Text style={[styles.resultValue, styles.totalValue]}>{formatCurrency(taxResults.totalFederalTax)}</Text>
          </View>
        </View>
        
        {taxResults.stateTax > 0 && (
          <View style={styles.resultCard}>
            <Text style={styles.resultCardTitle}>State Taxes</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>State Income Tax</Text>
              <Text style={styles.resultValue}>{formatCurrency(taxResults.stateTax)}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>Tax Summary</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Tax</Text>
            <Text style={[styles.resultValue, styles.totalValue]}>{formatCurrency(taxResults.totalTax)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Effective Tax Rate</Text>
            <Text style={[styles.resultValue, styles.totalValue]}>{taxResults.effectiveTaxRate.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Quarterly Estimated Tax</Text>
            <Text style={[styles.resultValue, styles.totalValue]}>{formatCurrency(taxResults.quarterlyTax)}</Text>
          </View>
        </View>
        
        <View style={styles.taxTipsContainer}>
          <Text style={styles.taxTipsTitle}>Tax Tips</Text>
          <Text style={styles.taxTipsText}>
            • Remember to save {taxResults.effectiveTaxRate.toFixed(0)}% of your income for taxes
          </Text>
          <Text style={styles.taxTipsText}>
            • Make quarterly estimated tax payments to avoid penalties
          </Text>
          <Text style={styles.taxTipsText}>
            • Keep detailed records of all business expenses
          </Text>
          <Text style={styles.taxTipsText}>
            • Consider consulting with a tax professional for personalized advice
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading tax calculator...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tax Calculator</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Income & Expenses</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Annual Income</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={income}
              onChangeText={setIncome}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Expenses</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={expenses}
              onChangeText={setExpenses}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tax Year</Text>
          <TextInput
            style={styles.input}
            placeholder="2023"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />
        </View>

        <View style={styles.taxSettingsContainer}>
          <View style={styles.taxSettingsHeader}>
            <Text style={styles.taxSettingsTitle}>Your Tax Settings</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('TaxSettings')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.taxSettingRow}>
            <Text style={styles.taxSettingLabel}>Country:</Text>
            <Text style={styles.taxSettingValue}>{taxSettings.country}</Text>
          </View>
          
          {taxSettings.country === 'US' && (
            <View style={styles.taxSettingRow}>
              <Text style={styles.taxSettingLabel}>State:</Text>
              <Text style={styles.taxSettingValue}>{taxSettings.state || 'Not set'}</Text>
            </View>
          )}
          
          <View style={styles.taxSettingRow}>
            <Text style={styles.taxSettingLabel}>Business Type:</Text>
            <Text style={styles.taxSettingValue}>
              {taxSettings.businessType === 'sole_prop' ? 'Sole Proprietorship' : 
               taxSettings.businessType === 'llc_single' ? 'Single-Member LLC' :
               taxSettings.businessType === 'llc_multi' ? 'Multi-Member LLC' :
               taxSettings.businessType === 's_corp' ? 'S Corporation' :
               taxSettings.businessType === 'c_corp' ? 'C Corporation' :
               taxSettings.businessType === 'partnership' ? 'Partnership' : 
               taxSettings.businessType}
            </Text>
          </View>
          
          <View style={styles.taxSettingRow}>
            <Text style={styles.taxSettingLabel}>Filing Status:</Text>
            <Text style={styles.taxSettingValue}>
              {taxSettings.filingStatus === 'single' ? 'Single' :
               taxSettings.filingStatus === 'married_joint' ? 'Married Filing Jointly' :
               taxSettings.filingStatus === 'married_separate' ? 'Married Filing Separately' :
               taxSettings.filingStatus === 'head_household' ? 'Head of Household' :
               taxSettings.filingStatus === 'qualifying_widow' ? 'Qualifying Widow(er)' :
               taxSettings.filingStatus}
            </Text>
          </View>
          
          <View style={styles.taxSettingRow}>
            <Text style={styles.taxSettingLabel}>Dependents:</Text>
            <Text style={styles.taxSettingValue}>{taxSettings.dependents}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.calculateButton}
          onPress={handleCalculate}
          disabled={isCalculating}
        >
          <Text style={styles.calculateButtonText}>
            {isCalculating ? 'Calculating...' : 'Calculate Taxes'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderTaxResults()}
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
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencySymbol: {
    fontSize: 18,
    color: colors.text,
    paddingLeft: 15,
  },
  amountInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  taxSettingsContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taxSettingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taxSettingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  taxSettingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  taxSettingLabel: {
    fontSize: 14,
    color: colors.textLight,
    width: 120,
  },
  taxSettingValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.text,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  totalValue: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  taxTipsContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  taxTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  taxTipsText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
}); 