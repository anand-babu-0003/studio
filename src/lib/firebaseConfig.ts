
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'; // Added Firestore type

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let firestoreInstance: Firestore | null = null;

const IS_SERVER = typeof window === 'undefined';
const logPrefix = IS_SERVER ? "[SERVER FirebaseConfig]" : "[CLIENT FirebaseConfig]";

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error(`${logPrefix} CRITICAL_ERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in environment variables. Firebase will not initialize correctly.`);
}

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(
    `${logPrefix} FIREBASE CRITICAL ERROR: Missing Firebase config values for keys: ${missingKeys.join(', ')}. Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set.`
  );
  console.warn(`${logPrefix} Firebase services will be UNUSABLE.`);
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      // console.log(`${logPrefix} Firebase app initialized successfully (new instance).`); // Reduced verbosity
    } catch (error) {
      console.error(`${logPrefix} FIREBASE CRITICAL ERROR: Failed to initialize Firebase app:`, error);
      app = undefined;
    }
  } else {
    app = getApp();
    // console.log(`${logPrefix} Firebase app retrieved successfully (existing instance).`); // Reduced verbosity
  }

  if (app) {
    if (app.options.projectId !== firebaseConfig.projectId) {
        console.warn(`${logPrefix} WARNING: Initialized/Retrieved app Project ID (${app.options.projectId}) does not match the one in firebaseConfig (${firebaseConfig.projectId}). This might indicate a configuration issue or multiple initializations.`);
    }
    try {
      firestoreInstance = getFirestore(app);
      if (firestoreInstance && typeof (firestoreInstance as any).type === 'string' && (firestoreInstance as any).type === 'firestore') {
         // console.log(`${logPrefix} Firestore instance obtained successfully.`); // Reduced verbosity
      } else {
        console.warn(`${logPrefix} Firestore instance obtained, but it doesn't look like a valid Firestore object. Type:`, typeof firestoreInstance, firestoreInstance);
        firestoreInstance = null;
      }
    } catch (error) {
      console.error(`${logPrefix} FIREBASE CRITICAL ERROR: Failed to get Firestore instance:`, error);
      firestoreInstance = null;
    }
  } else {
     console.warn(`${logPrefix} Firebase app object is undefined after initialization attempt. Firestore cannot be initialized.`);
     firestoreInstance = null;
  }
}

if (firestoreInstance) {
    console.log(`${logPrefix} Firebase & Firestore are configured.`);
} else {
    console.error(`${logPrefix} Firebase & Firestore ARE NOT CONFIGURED or available. Admin panel and other Firestore-dependent features will fail. CHECK YOUR ENVIRONMENT VARIABLES AND FIREBASE CONSOLE!`);
}

export { firestoreInstance as firestore, firebaseConfig, app as firebaseApp };
