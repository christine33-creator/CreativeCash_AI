import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../hooks/useAuth';
import { incomeService } from '../../services/income.service';
import { INCOME_SOURCES, PAYMENT_METHODS, TAX_CATEGORIES } from '../../types/income.types';

export const AddIncomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectName: '',
    incomeSource: INCOME_SOURCES[0],
    amount: '',
    paymentMethod: PAYMENT_METHODS[0],
    transactionDate: new Date(),
    notes: '',
    taxCategory: TAX_CATEGORIES[0]
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formData.projectName || !formData.amount) {
        setError('Project name and amount are required');
        return;
      }

      await incomeService.createIncome(user!.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>Add New Income</Text>

      <Input
        label="Project Name"
        value={formData.projectName}
        onChangeText={(text) => setFormData({ ...formData, projectName: text })}
        placeholder="Enter project name"
      />

      <Text style={styles.label}>Income Source</Text>
      <Picker
        selectedValue={formData.incomeSource}
        onValueChange={(value) => setFormData({ ...formData, incomeSource: value })}
        style={styles.picker}
      >
        {INCOME_SOURCES.map((source) => (
          <Picker.Item key={source} label={source} value={source} />
        ))}
      </Picker>

      <Input
        label="Amount"
        value={formData.amount}
        onChangeText={(text) => setFormData({ ...formData, amount: text })}
        keyboardType="numeric"
        placeholder="Enter amount"
        leftIcon={{ type: 'material', name: 'attach-money' }}
      />

      <Text style={styles.label}>Payment Method</Text>
      <Picker
        selectedValue={formData.paymentMethod}
        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
        style={styles.picker}
      >
        {PAYMENT_METHODS.map((method) => (
          <Picker.Item key={method} label={method} value={method} />
        ))}
      </Picker>

      <Text style={styles.label}>Transaction Date</Text>
      <DateTimePicker
        value={formData.transactionDate}
        mode="date"
        display="default"
        onChange={(event, date) => date && setFormData({ ...formData, transactionDate: date })}
      />

      <Text style={styles.label}>Tax Category</Text>
      <Picker
        selectedValue={formData.taxCategory}
        onValueChange={(value) => setFormData({ ...formData, taxCategory: value })}
        style={styles.picker}
      >
        {TAX_CATEGORIES.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>

      <Input
        label="Notes (Optional)"
        value={formData.notes}
        onChangeText={(text) => setFormData({ ...formData, notes: text })}
        multiline
        numberOfLines={3}
        placeholder="Add any additional notes"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Save Income"
        onPress={handleSubmit}
        loading={isLoading}
        containerStyle={styles.buttonContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#86939e',
    marginBottom: 5,
    marginLeft: 10,
  },
  picker: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AddIncomeScreen; 