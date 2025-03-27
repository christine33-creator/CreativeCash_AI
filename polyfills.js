// Add necessary polyfills for web
import 'react-native-gesture-handler/jestSetup';

// Polyfill for AsyncStorage on web
if (typeof window !== 'undefined') {
  const localStorageShim = {
    getItem: (key) => {
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key, value) => {
      return Promise.resolve(localStorage.setItem(key, value));
    },
    removeItem: (key) => {
      return Promise.resolve(localStorage.removeItem(key));
    },
  };

  if (!window.ReactNativeWebView) {
    window.ReactNativeWebView = {};
  }
} 