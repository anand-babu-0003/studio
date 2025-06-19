
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

if (!firebaseConfig.apiKey ||
    !firebaseConfig.projectId ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.storageBucket ||
    !firebaseConfig.messagingSenderId ||
    !firebaseConfig.appId) {
      console.warn(
        "Firebase config is missing or incomplete. " +
        "Please ensure all NEXT_PUBLIC_FIREBASE_ prefixed environment variables are set in your .env file or hosting provider. " +
        "Firebase will NOT be initialized. Some features may not work."
      );
      // app will remain undefined, and firestore will be null
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Failed to initialize Firebase app:", error);
      // app will remain undefined or be whatever initializeApp returns on error
    }
  } else {
    app = getApp(); // Get the default app if already initialized
  }
}


// Get Firestore instance
// Ensure app is defined and initialized before calling getFirestore
const firestore = app ? getFirestore(app) : null;

if (app && !firestore) {
  // This warning will appear if app initialization succeeded but getFirestore failed for some reason
  console.warn("Firebase app initialized, but Firestore could not be obtained. Please check Firestore service status and configuration.");
} else if (!app && firebaseConfig.apiKey) { // Only show this if config was present but app init failed
  console.warn("Firestore could not be initialized because the Firebase app was not initialized successfully, despite config being present.");
}


export { firestore, firebaseConfig, app as firebaseApp };
