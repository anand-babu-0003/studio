
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
if (getApps().length === 0) {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "Firebase config is missing or incomplete. " +
      "Ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID (and others) are set in your .env file. " +
      "Firebase will not be initialized."
    );
    // You might throw an error here or handle it based on your app's needs
    // For now, we'll let it proceed, but Firestore operations will likely fail.
  }
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Failed to initialize Firebase app:", error);
    // Handle initialization error, e.g., by setting app to undefined or re-throwing
  }
} else {
  app = getApp();
}

// Get Firestore instance
// Ensure app is defined before calling getFirestore
const firestore = app ? getFirestore(app) : null;

if (!firestore) {
  console.warn("Firestore could not be initialized. Ensure Firebase app was initialized successfully.");
}


export { firestore, firebaseConfig, app as firebaseApp };
