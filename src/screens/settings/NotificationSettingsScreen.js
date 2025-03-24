import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

export default function NotificationSettingsScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    enableNotifications: true,
    incomeReminders: true,
    taxDeadlines: true,
    goalProgress: true,
    weeklyReports: false,
    clientPayments: true,
    invoiceDue: true,
    marketUpdates: false
  });
  
  useEffect(() => {
    // In a real app, you would fetch notification settings from your backend
    // For now, we'll simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, you would save these settings to your backend
    Alert.alert('Success', 'Notification settings saved successfully');
    navigation.goBack();
  };
  
  const renderToggleSetting = (title, description, setting) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[setting]}
        onValueChange={() => handleToggle(setting)}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.masterToggleContainer}>
            <View style={styles.settingInfo}>
              <Text style={styles.masterToggleTitle}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Turn on/off all notifications from CreativeCash
              </Text>
            </View>
            <Switch
              value={settings.enableNotifications}
              onValueChange={() => handleToggle('enableNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          {settings.enableNotifications && (
            <>
              <Text style={styles.sectionTitle}>Income & Expenses</Text>
              {renderToggleSetting(
                'Income Reminders',
                'Get reminders about upcoming payments from clients',
                'incomeReminders'
              )}
              {renderToggleSetting(
                'Tax Deadlines',
                'Receive alerts about tax filing and payment deadlines',
                'taxDeadlines'
              )}
              {renderToggleSetting(
                'Weekly Financial Reports',
                'Get a summary of your weekly financial activity',
                'weeklyReports'
              )}
              
              <Text style={styles.sectionTitle}>Goals & Progress</Text>
              {renderToggleSetting(
                'Goal Progress Updates',
                'Receive updates when you make progress toward your financial goals',
                'goalProgress'
              )}
              
              <Text style={styles.sectionTitle}>Clients & Invoices</Text>
              {renderToggleSetting(
                'Client Payment Notifications',
                'Get notified when clients make payments',
                'clientPayments'
              )}
              {renderToggleSetting(
                'Invoice Due Reminders',
                'Receive reminders about upcoming invoice due dates',
                'invoiceDue'
              )}
              
              <Text style={styles.sectionTitle}>Other</Text>
              {renderToggleSetting(
                'Market & Industry Updates',
                'Get insights about market trends relevant to your business',
                'marketUpdates'
              )}
            </>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textLight} />
          <Text style={styles.infoText}>
            You can customize how and when you receive notifications. 
            Changes to these settings will apply to all your devices.
          </Text>
        </View>
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 10,
    margin: 15,
    padding: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  masterToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 15,
  },
  masterToggleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    paddingTop: 0,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
}); 