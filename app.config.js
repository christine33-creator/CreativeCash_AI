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
    },
  },
  env: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://mzjtokatolreshwfwgnh.supabase.co",
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16anRva2F0b2xyZXNod2Z3Z25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzU0NzMsImV4cCI6MjA1ODI1MTQ3M30.OmPONDxVzqdmkMHuv_1wsCdocCwEyLBFENMKwOisyVY",
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBo-HwCAW_OhfcUqmMhhm4jrcy7fTiN7ws",
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "creativecashai.firebaseapp.com",
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "creativecashai",
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "creativecashai.firebasestorage.app",
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "882067255972",
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:882067255972:web:7e8d782205375b97dbac31"
  }
}; 