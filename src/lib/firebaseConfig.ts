
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let firestore: ReturnType<typeof getFirestore> | null = null;

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
let missingKeys: string[] = [];

if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  console.warn("Running in test environment, Firebase initialization might be skipped or mocked.");
} else {
  missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.groupCollapsed("%cFirebase Initialization Warning", "color: orange; font-weight: bold;");
    console.warn(
      `Firebase config is missing or incomplete. The following keys are missing from your environment variables (NEXT_PUBLIC_FIREBASE_...):`
    );
    missingKeys.forEach(key => console.warn(`- ${key}`));
    console.warn(
      "Firebase will NOT be fully initialized. Some features, especially those relying on Firestore, may not work correctly or at all."
    );
    console.warn("Please ensure all required NEXT_PUBLIC_FIREBASE_ prefixed environment variables are correctly set in your .env file (for local development) and in your Vercel/Netlify project settings (for deployment)."
    );
    console.groupEnd();
  } else {
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
      } catch (error) {
        console.error("Critical error: Failed to initialize Firebase app:", error);
        app = undefined; // Ensure app is undefined if initialization fails
      }
    } else {
      app = getApp();
    }

    if (app) {
      try {
        firestore = getFirestore(app);
      } catch (error) {
        console.error("Critical error: Failed to get Firestore instance:", error);
        firestore = null; // Ensure firestore is null if it fails
      }
    } else {
       console.warn("Firebase app object is undefined. Firestore cannot be initialized.");
       firestore = null;
    }

    if (app && !firestore) {
      console.warn("Firebase app initialized, but Firestore could not be obtained. Please check Firestore service status, configuration, and security rules in your Firebase project.");
    }
  }
}

export { firestore, firebaseConfig, app as firebaseApp };
