import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { useAuth } from '../hooks/useAuth';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddIncomeScreen from '../screens/income/AddIncomeScreen';
import IncomeListScreen from '../screens/income/IncomeListScreen';
import EditIncomeScreen from '../screens/income/EditIncomeScreen';
import { CategoryManagementScreen } from '../screens/settings/CategoryManagementScreen';
import IncomeVisualizationScreen from '../screens/visualization/IncomeVisualizationScreen';
import FinancialReportsScreen from '../screens/reports/FinancialReportsScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
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
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // App Stack
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                headerTitle: 'My Profile',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="IncomeList" 
              component={IncomeListScreen}
              options={{
                headerTitle: 'Income',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="AddIncome" 
              component={AddIncomeScreen}
              options={{
                headerTitle: 'Add Income',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="EditIncome" 
              component={EditIncomeScreen}
              options={{
                headerTitle: 'Edit Income',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="CategoryManagement" 
              component={CategoryManagementScreen}
              options={{
                headerTitle: 'Manage Categories',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="IncomeVisualization" 
              component={IncomeVisualizationScreen}
              options={{
                headerTitle: 'Income Visualization',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="FinancialReports" 
              component={FinancialReportsScreen}
              options={{
                headerTitle: 'Financial Reports',
                headerShown: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 