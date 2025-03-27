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
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { logout, user } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 20,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.white,
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.white,
      opacity: 0.8,
    },
    section: {
      marginTop: 20,
      backgroundColor: colors.card,
      borderRadius: 10,
      marginHorizontal: 15,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textLight,
      marginHorizontal: 15,
      marginTop: 20,
      marginBottom: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 30,
      alignItems: 'center',
      marginRight: 10,
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    menuRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuValue: {
      fontSize: 16,
      color: colors.textLight,
      marginRight: 5,
    },
    logoutButton: {
      backgroundColor: colors.error,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginHorizontal: 15,
      marginTop: 30,
      marginBottom: 30,
    },
    logoutButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
        <Text style={dynamicStyles.headerSubtitle}>
          {user?.email || 'User'}
        </Text>
      </View>
      
      <Text style={dynamicStyles.sectionTitle}>Account</Text>
      <View style={dynamicStyles.section}>
        <TouchableOpacity 
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={dynamicStyles.menuIcon}>
            <Ionicons name="person-outline" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.menuText}>Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('TaxSettings')}
        >
          <View style={dynamicStyles.menuIcon}>
            <Ionicons name="calculator-outline" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.menuText}>Tax Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <View style={dynamicStyles.menuIcon}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.menuItem}>
          <View style={dynamicStyles.menuIcon}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny-outline"} 
              size={24} 
              color={colors.primary} 
            />
          </View>
          <Text style={dynamicStyles.menuText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>
      
      <Text style={dynamicStyles.sectionTitle}>Tools</Text>
      <View style={dynamicStyles.section}>
        <TouchableOpacity 
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('TaxCalculator')}
        >
          <View style={dynamicStyles.menuIcon}>
            <Ionicons name="calculator-outline" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.menuText}>Tax Calculator</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('DeductionFinder')}
        >
          <View style={dynamicStyles.menuIcon}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.menuText}>Deduction Finder</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('AIChat')}
        >
          <View style={dynamicStyles.menuIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
          </View>
          <Text style={dynamicStyles.menuText}>AI Assistant</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={dynamicStyles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={dynamicStyles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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