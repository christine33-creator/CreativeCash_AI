import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled by the auth state change
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to log out');
            }
          }
        }
      ]
    );
  };

  const renderSettingItem = (icon, title, onPress, rightElement = null) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {renderSectionHeader('Account')}
      <View style={styles.settingsGroup}>
        {renderSettingItem('person-outline', 'Profile', () => navigation.navigate('Profile'))}
        {renderSettingItem('card-outline', 'Payment Methods', () => Alert.alert('Coming Soon', 'This feature is coming soon!'))}
        {renderSettingItem('receipt-outline', 'Tax Information', () => navigation.navigate('TaxSettings'))}
        {renderSettingItem('calculator-outline', 'Tax Calculator', () => navigation.navigate('TaxCalculator'))}
        {renderSettingItem('search-outline', 'Deduction Finder', () => navigation.navigate('DeductionFinder'))}
        {renderSettingItem('analytics-outline', 'AI Financial Insights', () => navigation.navigate('AIInsights'))}
        {renderSettingItem('people-outline', 'Client Management', () => navigation.navigate('ClientManagement'))}
      </View>

      {renderSectionHeader('Preferences')}
      <View style={styles.settingsGroup}>
        {renderSettingItem('notifications-outline', 'Notifications', null, (
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ))}
        {renderSettingItem('moon-outline', 'Dark Mode', null, (
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ))}
        {renderSettingItem('finger-print-outline', 'Biometric Login', null, (
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ))}
        {renderSettingItem('globe-outline', 'Currency', () => Alert.alert('Coming Soon', 'This feature is coming soon!'))}
        {renderSettingItem('notifications-outline', 'Notification Settings', () => navigation.navigate('NotificationSettings'))}
      </View>

      {renderSectionHeader('Support')}
      <View style={styles.settingsGroup}>
        {renderSettingItem('help-circle-outline', 'Help Center', () => Alert.alert('Coming Soon', 'This feature is coming soon!'))}
        {renderSettingItem('document-text-outline', 'Terms of Service', () => Alert.alert('Coming Soon', 'This feature is coming soon!'))}
        {renderSettingItem('shield-outline', 'Privacy Policy', () => Alert.alert('Coming Soon', 'This feature is coming soon!'))}
        {renderSettingItem('mail-outline', 'Contact Us', () => Alert.alert('Coming Soon', 'This feature is coming soon!'))}
      </View>

      {renderSectionHeader('App')}
      <View style={styles.settingsGroup}>
        {renderSettingItem('information-circle-outline', 'About', () => Alert.alert('About', 'CreativeCash AI\nVersion 1.0.0'))}
        {renderSettingItem('log-out-outline', 'Logout', handleLogout)}
        {renderSettingItem('calendar-outline', 'Financial Calendar', () => navigation.navigate('FinancialCalendar'))}
        {renderSettingItem('flag-outline', 'Financial Goals', () => navigation.navigate('GoalSetting'))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CreativeCash AI v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  profileSection: {
    backgroundColor: colors.white,
    marginBottom: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInitial: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textLight,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingsGroup: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
  },
}); 