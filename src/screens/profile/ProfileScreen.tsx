import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Text, Divider } from 'react-native-elements';
import { useAuth } from '../../hooks/useAuth';
import { validateName, validateEmail } from '../../utils/validation';
import { Picker } from '@react-native-picker/picker';

export const ProfileScreen = () => {
  const { user, updateProfile, error, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currencyPreference: user?.currencyPreference || 'USD',
    taxCountry: user?.taxCountry || '',
    taxState: user?.taxState || '',
    freelanceStatus: user?.freelanceStatus || 'individual'
  });

  const [formErrors, setFormErrors] = useState({
    firstName: null,
    lastName: null,
    email: null
  });

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const freelanceStatuses = [
    { label: 'Individual Freelancer', value: 'individual' },
    { label: 'Registered Business', value: 'business' },
    { label: 'Agency', value: 'agency' }
  ];

  const handleUpdate = async () => {
    // Clear previous errors
    setFormErrors({
      firstName: null,
      lastName: null,
      email: null
    });

    // Validate inputs
    const firstNameError = validateName(formData.firstName, 'First name');
    const lastNameError = validateName(formData.lastName, 'Last name');
    const emailError = validateEmail(formData.email);

    if (firstNameError || lastNameError || emailError) {
      setFormErrors({
        firstName: firstNameError,
        lastName: lastNameError,
        email: emailError
      });
      return;
    }

    await updateProfile(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.sectionTitle}>Personal Information</Text>
      
      <Input
        label="First Name"
        value={formData.firstName}
        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        errorMessage={formErrors.firstName || ''}
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        errorMessage={formErrors.lastName || ''}
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        errorMessage={formErrors.email || ''}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Divider style={styles.divider} />
      <Text h4 style={styles.sectionTitle}>Preferences</Text>

      <Text style={styles.label}>Currency</Text>
      <Picker
        selectedValue={formData.currencyPreference}
        onValueChange={(value) => setFormData({ ...formData, currencyPreference: value })}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      <Divider style={styles.divider} />
      <Text h4 style={styles.sectionTitle}>Tax Information</Text>

      <Input
        label="Country"
        value={formData.taxCountry}
        onChangeText={(text) => setFormData({ ...formData, taxCountry: text })}
      />

      <Input
        label="State/Province"
        value={formData.taxState}
        onChangeText={(text) => setFormData({ ...formData, taxState: text })}
      />

      <Text style={styles.label}>Freelance Status</Text>
      <Picker
        selectedValue={formData.freelanceStatus}
        onValueChange={(value) => setFormData({ ...formData, freelanceStatus: value })}
        style={styles.picker}
      >
        {freelanceStatuses.map((status) => (
          <Picker.Item key={status.value} label={status.label} value={status.value} />
        ))}
      </Picker>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Update Profile"
        onPress={handleUpdate}
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
  sectionTitle: {
    marginVertical: 15,
  },
  divider: {
    marginVertical: 20,
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

export default ProfileScreen; 