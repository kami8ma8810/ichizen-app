import { User as FirebaseUser } from 'firebase/auth';

// ユーザー情報の型
export interface User {
  id: string;
  uid: string; // Firebase UID
  email: string | null;
  name: string | null;
  image: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  settings: UserSettings;
}

// ユーザー設定
export interface UserSettings {
  notificationTime?: string; // HH:mm形式
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

// 認証状態
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ログインフォーム
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 新規登録フォーム
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// 認証方法
export type AuthProvider = 'google' | 'apple' | 'anonymous' | 'email';

// 認証結果
export interface AuthResult {
  user: User;
  isNewUser: boolean;
  provider: AuthProvider;
}

// 認証エラー
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Firebase Userから独自のUser型への変換
export function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    image: firebaseUser.photoURL,
    isAnonymous: firebaseUser.isAnonymous,
    emailVerified: firebaseUser.emailVerified,
    createdAt: firebaseUser.metadata.creationTime 
      ? new Date(firebaseUser.metadata.creationTime) 
      : new Date(),
    lastLoginAt: firebaseUser.metadata.lastSignInTime 
      ? new Date(firebaseUser.metadata.lastSignInTime) 
      : new Date(),
    settings: {
      timezone: 'Asia/Tokyo',
      language: 'ja',
      theme: 'system',
    },
  };
} 