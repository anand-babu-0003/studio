
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

let app;
let firestore: ReturnType<typeof getFirestore> | null = null;

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(
    "FIREBASE INITIALIZATION ERROR: Missing critical Firebase config values. Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are set in your .env file and in your Vercel project settings.",
    "Missing keys:", missingKeys.join(', ')
  );
  console.warn("Firebase will NOT be initialized. Firestore and other Firebase services will be unavailable.");
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      // console.log("Firebase app initialized successfully."); // Reduced verbosity
    } catch (error) {
      console.error("FIREBASE INITIALIZATION ERROR: Failed to initialize Firebase app:", error);
      app = undefined; 
    }
  } else {
    app = getApp();
    // console.log("Existing Firebase app retrieved."); // Reduced verbosity
  }

  if (app) {
    try {
      firestore = getFirestore(app);
      // console.log("Firestore instance obtained successfully."); // Reduced verbosity
    } catch (error) {
      console.error("FIREBASE INITIALIZATION ERROR: Failed to get Firestore instance:", error);
      firestore = null;
    }
  } else {
     console.warn("Firebase app object is undefined after initialization attempt. Firestore cannot be initialized.");
     firestore = null;
  }

  if (app && !firestore) {
    console.warn("Firebase app was initialized, but Firestore could not be obtained. Check Firestore service status and rules in your Firebase project.");
  }
}

export { firestore, firebaseConfig, app as firebaseApp };
