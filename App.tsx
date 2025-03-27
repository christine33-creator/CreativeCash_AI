import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';

// Main Screens
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import IncomeListScreen from './src/screens/income/IncomeListScreen';
import AddIncomeScreen from './src/screens/income/AddIncomeScreen';
import VisualizationScreen from './src/screens/visualization/VisualizationScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import EditIncomeScreen from './src/screens/income/EditIncomeScreen';
import ProfileScreen from './src/screens/settings/ProfileScreen';
import TaxSettingsScreen from './src/screens/settings/TaxSettingsScreen';
import TaxCalculatorScreen from './src/screens/tax/TaxCalculatorScreen';
import DeductionFinderScreen from './src/screens/tax/DeductionFinderScreen';
import AIInsightsScreen from './src/screens/insights/AIInsightsScreen';
import DocumentScannerScreen from './src/screens/documents/DocumentScannerScreen';
import InvoiceGeneratorScreen from './src/screens/invoices/InvoiceGeneratorScreen';
import ClientManagementScreen from './src/screens/clients/ClientManagementScreen';
import ClientDetailScreen from './src/screens/clients/ClientDetailScreen';
import FinancialCalendarScreen from './src/screens/calendar/FinancialCalendarScreen';
import GoalSettingScreen from './src/screens/goals/GoalSettingScreen';
import NotificationSettingsScreen from './src/screens/settings/NotificationSettingsScreen';
import AIChatScreen from './src/screens/ai/AIChatScreen';

import { colors } from './src/styles/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Function to create the bottom tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Income') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Income" component={IncomeListScreen} />
      <Tab.Screen name="Analytics" component={VisualizationScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ marginTop: 20, color: colors.text }}>Loading...</Text>
    </View>
  );
}

// Main App component with navigation structure
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  // Simulate app initialization
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !appReady) {
    return <LoadingScreen />;
  }

  // For development, let's force the app to show the main screens
  const forceMainScreens = true;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated && !forceMainScreens ? (
          // Auth Stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Signup" 
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="AddIncome" 
              component={AddIncomeScreen}
              options={{
                title: 'Add Income',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="EditIncome" 
              component={EditIncomeScreen}
              options={{
                title: 'Edit Income',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                title: 'Profile',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="TaxSettings" 
              component={TaxSettingsScreen}
              options={{
                title: 'Tax Settings',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="TaxCalculator" 
              component={TaxCalculatorScreen}
              options={{
                title: 'Tax Calculator',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="DeductionFinder" 
              component={DeductionFinderScreen}
              options={{
                title: 'Deduction Finder',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="AIInsights" 
              component={AIInsightsScreen}
              options={{
                title: 'AI Insights',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="DocumentScanner" 
              component={DocumentScannerScreen}
              options={{
                title: 'Document Scanner',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="InvoiceGenerator" 
              component={InvoiceGeneratorScreen}
              options={{
                title: 'Invoice Generator',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="ClientManagement" 
              component={ClientManagementScreen}
              options={{
                title: 'Clients',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="ClientDetail" 
              component={ClientDetailScreen}
              options={{
                title: 'Client Details',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="FinancialCalendar" 
              component={FinancialCalendarScreen}
              options={{
                title: 'Financial Calendar',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="GoalSetting" 
              component={GoalSettingScreen}
              options={{
                title: 'Financial Goals',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="NotificationSettings" 
              component={NotificationSettingsScreen}
              options={{
                title: 'Notification Settings',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="AIChat" 
              component={AIChatScreen}
              options={{
                title: 'AI Financial Assistant',
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
} 