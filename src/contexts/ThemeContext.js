import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define light and dark theme colors
const lightTheme = {
  primary: '#5C6BC0',
  secondary: '#7986CB',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#333333',
  textLight: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
};

const darkTheme = {
  primary: '#3F51B5',
  secondary: '#5C6BC0',
  background: '#121212',
  card: '#1E1E1E',
  text: '#E0E0E0',
  textLight: '#9E9E9E',
  border: '#333333',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFCA28',
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
};

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePreference');
        
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        } else {
          // Use device theme as default if no stored preference
          setIsDarkMode(deviceTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        // Fallback to device theme
        setIsDarkMode(deviceTheme === 'dark');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [deviceTheme]);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light')
        .catch(error => console.error('Error saving theme preference:', error));
    }
  }, [isDarkMode, isLoading]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Current theme colors
  const colors = isDarkMode ? darkTheme : lightTheme;

  // Context value
  const value = {
    isDarkMode,
    toggleTheme,
    colors,
    isLoading: isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 