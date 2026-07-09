/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, UserCredential } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { UserProgress } from '../types';

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

// Dynamic check to retrieve config
export function getFirebaseConfig(): any | null {
  // 1. Try local storage custom config first (convenient for user testing)
  const savedConfig = localStorage.getItem('firebase-custom-config');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Invalid custom Firebase config format in localStorage');
    }
  }

  // 2. Try environment variables
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: metaEnv.VITE_FIREBASE_API_KEY,
      authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
      storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: metaEnv.VITE_FIREBASE_APP_ID
    };
  }

  return null;
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig() !== null;
}

// Lazy initialization of Firebase elements to avoid crashes if keys are not set
export function getFirebaseApp(): FirebaseApp {
  const config = getFirebaseConfig();
  if (!config) {
    throw new Error('Firebase configuration is missing. Configure it in the Firebase Control Panel.');
  }

  if (getApps().length > 0) {
    return getApp();
  }

  if (!appInstance) {
    appInstance = initializeApp(config);
  }
  return appInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = getFirebaseApp();
    authInstance = getAuth(app);
  }
  return authInstance;
}

export function getFirebaseDb(): Firestore {
  if (!dbInstance) {
    const app = getFirebaseApp();
    dbInstance = getFirestore(app);
  }
  return dbInstance;
}

// Interactive Auth Flows
export async function loginWithGoogle(): Promise<UserCredential | null> {
  if (!isFirebaseConfigured()) return null;
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

// Secure Data Syncing
export async function syncProgressToCloud(userId: string, progress: UserProgress): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getFirebaseDb();
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      ...progress,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('Progress successfully synced with Firestore.');
  } catch (error) {
    console.error('Error syncing progress with Firestore:', error);
    throw error;
  }
}

export async function fetchProgressFromCloud(userId: string): Promise<UserProgress | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const db = getFirebaseDb();
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProgress;
    }
  } catch (error) {
    console.error('Error fetching progress from Firestore:', error);
  }
  return null;
}
