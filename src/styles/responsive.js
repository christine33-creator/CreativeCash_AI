import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isWeb = Platform.OS === 'web';
export const isSmallScreen = width < 768;
export const isMediumScreen = width >= 768 && width < 1024;
export const isLargeScreen = width >= 1024;

export const getResponsiveValue = (mobile, tablet, desktop) => {
  if (isWeb) {
    if (isSmallScreen) return mobile;
    if (isMediumScreen) return tablet;
    return desktop;
  }
  return mobile;
}; 