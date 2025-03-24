import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../contexts/AuthContext';

// Tax data
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
];

const usStates = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

const businessTypes = [
  { code: 'sole_prop', name: 'Sole Proprietorship' },
  { code: 'llc_single', name: 'Single-Member LLC' },
  { code: 'llc_multi', name: 'Multi-Member LLC' },
  { code: 's_corp', name: 'S Corporation' },
  { code: 'c_corp', name: 'C Corporation' },
  { code: 'partnership', name: 'Partnership' },
];

export default function TaxSettingsScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Tax settings
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('');
  const [businessType, setBusinessType] = useState('sole_prop');
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState('');
  const [hasOtherIncome, setHasOtherIncome] = useState(false);
  const [otherIncomeAmount, setOtherIncomeAmount] = useState('');
  const [dependents, setDependents] = useState('0');
  const [filingStatus, setFilingStatus] = useState('single');

  useEffect(() => {
    // In a real app, you would fetch the user's tax settings from your backend
    // For now, we'll simulate loading
    setTimeout(() => {
      // Mock data
      setCountry('US');
      setState('CA');
      setBusinessType('sole_prop');
      setEstimatedAnnualIncome('75000');
      setHasOtherIncome(false);
      setOtherIncomeAmount('0');
      setDependents('0');
      setFilingStatus('single');
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    if (!state && country === 'US') {
      Alert.alert('Error', 'Please select a state');
      return;
    }

    if (!estimatedAnnualIncome || isNaN(parseFloat(estimatedAnnualIncome))) {
      Alert.alert('Error', 'Please enter a valid estimated annual income');
      return;
    }

    try {
      setIsSaving(true);
      
      // In a real app, you would save these settings to your backend
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile with tax settings
      await updateProfile({
        taxCountry: country,
        taxState: state,
        businessType,
        estimatedAnnualIncome: parseFloat(estimatedAnnualIncome),
        hasOtherIncome,
        otherIncomeAmount: hasOtherIncome ? parseFloat(otherIncomeAmount || '0') : 0,
        dependents: parseInt(dependents || '0'),
        filingStatus
      });
      
      Alert.alert('Success', 'Tax settings saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save tax settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading tax settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tax Settings</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Location Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
              style={styles.picker}
            >
              {countries.map((item) => (
                <Picker.Item key={item.code} label={item.name} value={item.code} />
              ))}
            </Picker>
          </View>
        </View>

        {country === 'US' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={state}
                onValueChange={(itemValue) => setState(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a state" value="" />
                {usStates.map((item) => (
                  <Picker.Item key={item.code} label={item.name} value={item.code} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Business Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={businessType}
              onValueChange={(itemValue) => setBusinessType(itemValue)}
              style={styles.picker}
            >
              {businessTypes.map((item) => (
                <Picker.Item key={item.code} label={item.name} value={item.code} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Income Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estimated Annual Freelance Income</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={estimatedAnnualIncome}
              onChangeText={setEstimatedAnnualIncome}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Do you have other income?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={hasOtherIncome ? 'yes' : 'no'}
              onValueChange={(itemValue) => setHasOtherIncome(itemValue === 'yes')}
              style={styles.picker}
            >
              <Picker.Item label="No" value="no" />
              <Picker.Item label="Yes" value="yes" />
            </Picker>
          </View>
        </View>

        {hasOtherIncome && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Other Annual Income</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={otherIncomeAmount}
                onChangeText={setOtherIncomeAmount}
              />
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Filing Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filingStatus}
              onValueChange={(itemValue) => setFilingStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Single" value="single" />
              <Picker.Item label="Married Filing Jointly" value="married_joint" />
              <Picker.Item label="Married Filing Separately" value="married_separate" />
              <Picker.Item label="Head of Household" value="head_household" />
              <Picker.Item label="Qualifying Widow(er)" value="qualifying_widow" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Dependents</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            value={dependents}
            onChangeText={setDependents}
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Tax Settings'}
          </Text>
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
    marginTop: 20,
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
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 