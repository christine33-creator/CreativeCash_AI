import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { validateEmail, validatePassword, validateName } from '../../utils/validation';

export const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useAuth();
  const navigation = useNavigation();
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSignup = async () => {
    // Clear previous errors
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);

    // Validate inputs
    const firstNameValidationError = validateName(firstName, 'First name');
    const lastNameValidationError = validateName(lastName, 'Last name');
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (firstNameValidationError || lastNameValidationError || 
        emailValidationError || passwordValidationError) {
      setFirstNameError(firstNameValidationError);
      setLastNameError(lastNameValidationError);
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    await signup(firstName, lastName, email, password);
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Create Account</Text>
      
      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setFirstNameError(null);
        }}
        leftIcon={{ type: 'material', name: 'person' }}
        errorMessage={firstNameError || ''}
      />

      <Input
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          setLastNameError(null);
        }}
        leftIcon={{ type: 'material', name: 'person' }}
        errorMessage={lastNameError || ''}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(null);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={{ type: 'material', name: 'email' }}
        errorMessage={emailError || ''}
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(null);
        }}
        secureTextEntry
        leftIcon={{ type: 'material', name: 'lock' }}
        errorMessage={passwordError || ''}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Sign Up"
        onPress={handleSignup}
        loading={isLoading}
        containerStyle={styles.buttonContainer}
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  linkContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  link: {
    color: '#2089dc',
  },
});

export default SignupScreen; 