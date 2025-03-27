export default {
  name: 'CreativeCash AI',
  slug: 'creative-cash-tracker',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kristin11.creativecashtracker'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.kristin11.creativecashtracker'
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
    name: 'CreativeCash AI',
    shortName: 'CreativeCash',
    description: 'Financial management for freelancers and creative professionals',
    backgroundColor: '#F5F7FA',
    themeColor: '#5C6BC0',
    orientation: 'portrait',
    lang: 'en',
    scope: '/',
    startUrl: '/',
    display: 'standalone',
  },
  extra: {
    eas: {
      projectId: '9722aa56-bc2f-414e-94ac-8ddf3d0134db'
    }
  }
}; 