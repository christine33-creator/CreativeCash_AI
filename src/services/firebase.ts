import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { LoginCredentials, SignupCredentials } from '../types/auth.types';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firebase service
export const firebaseService = {
  async resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  },

  login: async ({ email, password }: LoginCredentials) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  signup: async ({ email, password, firstName, lastName }: SignupCredentials) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(response.user, {
        displayName: `${firstName} ${lastName}`
      });
      return response.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};

export { db, auth };

// Mock for @react-native-firebase/auth for compatibility
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    // Mock implementation
    return () => {}; // Return unsubscribe function
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    // Forward to the web SDK
    return signInWithEmailAndPassword(auth, email, password);
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    // Forward to the web SDK
    return createUserWithEmailAndPassword(auth, email, password);
  },
  signOut: async () => {
    // Forward to the web SDK
    return signOut(auth);
  },
  sendPasswordResetEmail: async (email: string) => {
    // Forward to the web SDK
    return sendPasswordResetEmail(auth, email);
  }
};

// Export mock for @react-native-firebase/auth
export default {
  auth: () => mockAuth
}; 