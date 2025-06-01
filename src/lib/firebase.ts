import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { 
  getFirestore as getFirestoreSDK, 
  Firestore,
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { firebaseConfig, authConfig, isDevelopment, validateFirebaseConfig } from '@/config/firebase';

// Firebase アプリインスタンス
let app: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

/**
 * Firebase設定を検証し、有効な設定を返す
 */
function getValidatedFirebaseConfig(): FirebaseOptions {
  if (!validateFirebaseConfig()) {
    throw new Error('Firebase設定が不完全です');
  }

  // 必須フィールドがundefinedでないことを確認
  const config: FirebaseOptions = {
    apiKey: firebaseConfig.apiKey!,
    authDomain: firebaseConfig.authDomain!,
    projectId: firebaseConfig.projectId!,
    storageBucket: firebaseConfig.storageBucket!,
    messagingSenderId: firebaseConfig.messagingSenderId!,
    appId: firebaseConfig.appId!,
  };

  return config;
}

/**
 * Firebase アプリを初期化
 */
function initializeFirebase(): FirebaseApp {
  // 既に初期化済みの場合は既存のアプリを使用
  if (getApps().length > 0) {
    return getApps()[0] as FirebaseApp;
  }

  // Firebase アプリを初期化
  const config = getValidatedFirebaseConfig();
  const firebaseApp = initializeApp(config);
  
  if (isDevelopment) {
    console.log('🔥 Firebase アプリが初期化されました');
  }

  return firebaseApp;
}

/**
 * Firebase Auth を取得・設定
 */
function initializeAuth(): Auth {
  if (!app) {
    app = initializeFirebase();
  }

  const auth = getAuth(app);

  // 開発環境でのエミュレーター接続は本番デプロイ時のみ無効化
  if (isDevelopment && process.env['NEXT_PUBLIC_USE_FIREBASE_EMULATOR'] === 'true') {
    try {
      // エミュレーターがまだ接続されていない場合のみ接続
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('🔥 Firebase Auth エミュレーターに接続しました');
    } catch (error) {
      console.warn('⚠️ Firebase Auth エミュレーターへの接続に失敗:', error);
    }
  }

  // 永続化設定
  const persistenceType = authConfig.session.persistenceType === 'local' 
    ? browserLocalPersistence 
    : browserSessionPersistence;

  setPersistence(auth, persistenceType).catch((error: unknown) => {
    console.error('❌ Firebase Auth 永続化設定に失敗:', error);
  });

  return auth;
}

/**
 * Firestore を取得・設定
 */
function initializeFirestore(): Firestore {
  if (!app) {
    app = initializeFirebase();
  }

  const firestoreInstance = getFirestoreSDK(app);

  // 開発環境でのエミュレーター接続は本番デプロイ時のみ無効化
  if (isDevelopment && process.env['NEXT_PUBLIC_USE_FIREBASE_EMULATOR'] === 'true') {
    try {
      connectFirestoreEmulator(firestoreInstance, 'localhost', 8080);
      console.log('🔥 Firestore エミュレーターに接続しました');
    } catch (error) {
      console.warn('⚠️ Firestore エミュレーターへの接続に失敗:', error);
    }
  }

  return firestoreInstance;
}

// インスタンスを初期化（遅延初期化）
export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = initializeAuth();
  }
  return authInstance;
}

export function getFirestore(): Firestore {
  if (!dbInstance) {
    dbInstance = initializeFirestore();
  }
  return dbInstance;
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeFirebase();
  }
  return app;
}

// 便利な再エクスポート
export { 
  // Firebase Auth
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

// TypeScript型の再エクスポート
export type { User as FirebaseUser } from 'firebase/auth';

export {
  // Firestore
  doc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Firebase初期化の確認
if (typeof window !== 'undefined') {
  // ブラウザ環境でのみ初期化
  try {
    initializeFirebase();
  } catch (error) {
    console.error('❌ Firebase 初期化エラー:', error);
  }
}

// 直接使用可能なauth・dbインスタンスをエクスポート
export const auth = getFirebaseAuth();
export const firestore = getFirestore(); 