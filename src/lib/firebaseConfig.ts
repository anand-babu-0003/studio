
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

if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  console.warn("Running in test environment, Firebase initialization might be skipped or mocked.");
} else {
  missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.warn(
      `Firebase config is missing or incomplete. Missing keys: ${missingKeys.join(', ')}. ` +
      "Please ensure all NEXT_PUBLIC_FIREBASE_ prefixed environment variables are set. " +
      "Firebase will NOT be fully initialized. Some features may not work."
    );
  } else {
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
      } catch (error) {
        console.error("Failed to initialize Firebase app:", error);
        app = undefined;
      }
    } else {
      app = getApp();
    }

    if (app) {
      try {
        firestore = getFirestore(app);
      } catch (error) {
        console.error("Failed to get Firestore instance:", error);
        firestore = null;
      }
    } else {
       console.warn("Firebase app object is undefined. Firestore cannot be initialized.");
       firestore = null;
    }

    if (app && !firestore) {
      console.warn("Firebase app initialized, but Firestore could not be obtained. Please check Firestore service status and configuration.");
    }
  }
}

export { firestore, firebaseConfig, app as firebaseApp };
