import { Platform } from 'react-native';

export const initAnalytics = () => {
  if (Platform.OS === 'web') {
    // Web-specific analytics initialization
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Initialize analytics service of your choice
      console.log('Analytics initialized for web');
    }
  }
};

export const trackEvent = (eventName, properties = {}) => {
  // Track events across platforms
  console.log(`Event tracked: ${eventName}`, properties);
}; 