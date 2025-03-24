import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { validateEmail, validatePassword } from '../../utils/validation';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuth();
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);

    // Validate inputs
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Welcome Back</Text>
      
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
        title="Login"
        onPress={handleLogin}
        loading={isLoading}
        containerStyle={styles.buttonContainer}
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('Signup')}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>Forgot Password?</Text>
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

export default LoginScreen; 