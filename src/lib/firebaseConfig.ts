
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

if (IS_SERVER) {
    console.log("FirebaseConfig: SERVER-SIDE Execution Context");
} else {
    console.log("FirebaseConfig: CLIENT-SIDE Execution Context");
}

const logPrefix = IS_SERVER ? "[SERVER FirebaseConfig]" : "[CLIENT FirebaseConfig]";

console.log(`${logPrefix} Attempting Firebase initialization. Config Project ID: ${firebaseConfig.projectId || 'NOT SET'}`);

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(
    `${logPrefix} FIREBASE CRITICAL ERROR: Missing Firebase config values. Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are correctly set.`,
    "Missing keys:", missingKeys.join(', ')
  );
  console.warn(`${logPrefix} Firebase services will be UNUSABLE.`);
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      console.log(`${logPrefix} Firebase app initialized successfully (new).`);
    } catch (error) {
      console.error(`${logPrefix} FIREBASE CRITICAL ERROR: Failed to initialize Firebase app:`, error);
      app = undefined;
    }
  } else {
    app = getApp();
    console.log(`${logPrefix} Firebase app retrieved successfully (existing).`);
  }

  if (app) {
    try {
      firestoreInstance = getFirestore(app);
      if (firestoreInstance && typeof firestoreInstance.type === 'string' && firestoreInstance.type === 'firestore') {
         console.log(`${logPrefix} Firestore instance obtained successfully.`);
      } else {
        console.warn(`${logPrefix} Firestore instance obtained, but it doesn't look like a valid Firestore object. Type:`, typeof firestoreInstance);
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
    console.log(`${logPrefix} Firestore IS CONFIGURED and available.`);
} else {
    console.error(`${logPrefix} Firestore IS NOT CONFIGURED or available. Admin panel and other Firestore-dependent features will fail.`);
}

export { firestoreInstance as firestore, firebaseConfig, app as firebaseApp };
