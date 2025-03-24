import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../../utils/validation';

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { resetPassword, error, isLoading } = useAuth();
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    // Clear previous messages
    setEmailError(null);
    setSuccessMessage(null);

    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMessage('Password reset instructions have been sent to your email');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } catch (err) {
      // Error will be handled by the auth context
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>

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
        errorMessage={emailError || error}
      />

      {successMessage && (
        <Text style={styles.success}>{successMessage}</Text>
      )}

      <Button
        title="Send Reset Instructions"
        onPress={handleResetPassword}
        loading={isLoading}
        containerStyle={styles.buttonContainer}
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Back to Login</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  success: {
    color: 'green',
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

export default ForgotPasswordScreen; 