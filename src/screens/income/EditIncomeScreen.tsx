import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../hooks/useAuth';
import { incomeService } from '../../services/income.service';
import { INCOME_SOURCES, PAYMENT_METHODS, TAX_CATEGORIES } from '../../types/income.types';

export const EditIncomeScreen = ({ route, navigation }) => {
  const { income } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectName: income.projectName,
    incomeSource: income.incomeSource,
    amount: income.amount.toString(),
    paymentMethod: income.paymentMethod,
    transactionDate: new Date(income.transactionDate),
    notes: income.notes || '',
    taxCategory: income.taxCategory
  });

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formData.projectName || !formData.amount) {
        setError('Project name and amount are required');
        return;
      }

      await incomeService.updateIncome(income.id, {
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

  const handleDelete = () => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income record? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await incomeService.deleteIncome(income.id);
              navigation.goBack();
            } catch (err) {
              setError(err.message);
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.title}>Edit Income</Text>

      {/* Form fields similar to AddIncomeScreen */}
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

      {/* ... Other form fields ... */}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          title="Update Income"
          onPress={handleUpdate}
          loading={isLoading}
          containerStyle={styles.updateButton}
        />
        <Button
          title="Delete Income"
          onPress={handleDelete}
          type="outline"
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  buttonContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  updateButton: {
    marginBottom: 10,
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
});

export default EditIncomeScreen; 