// Firebase設定
export const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] || "AIzaSyDxexH-vCpdW5vo5t2EcsYO56I5fORQun8",
  authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || "ichizen-6c9c8.firebaseapp.com",
  projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || "ichizen-6c9c8",
  storageBucket: process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || "ichizen-6c9c8.firebasestorage.app",
  messagingSenderId: process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || "602753664944",
  appId: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'] || "1:602753664944:web:38bc3c5ff598fb3230f875",
};

// 認証設定
export const authConfig = {
  // サポートする認証方法
  providers: {
    google: {
      enabled: true,
      scopes: ['email', 'profile'],
    },
    apple: {
      enabled: true,
      scopes: ['email', 'name'],
    },
    anonymous: {
      enabled: true,
    },
    email: {
      enabled: true,
      requireEmailVerification: false, // 開発時はfalse
    },
  },
  
  // セッション設定
  session: {
    persistenceType: 'local' as const, // local, session, none
    tokenRefreshInterval: 55 * 60 * 1000, // 55分（1時間より短く）
  },
  
  // リダイレクト設定
  redirects: {
    afterSignIn: '/dashboard',
    afterSignOut: '/',
    afterSignUp: '/onboarding',
  },
  
  // エラーメッセージ（日本語）
  errorMessages: {
    'auth/user-not-found': 'ユーザーが見つかりません',
    'auth/wrong-password': 'パスワードが間違っています',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/weak-password': 'パスワードは6文字以上で設定してください',
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/too-many-requests': 'ログイン試行回数が多すぎます。しばらく時間をおいてから再試行してください',
    'auth/network-request-failed': 'ネットワークエラーが発生しました',
    'auth/popup-closed-by-user': 'ログインがキャンセルされました',
    'auth/cancelled-popup-request': 'ログインがキャンセルされました',
  },
} as const;

// 開発環境のチェック
export const isDevelopment = process.env['NODE_ENV'] === 'development';
export const isProduction = process.env['NODE_ENV'] === 'production';

// Firebase設定の検証
export function validateFirebaseConfig(): boolean {
  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  // 開発環境では、フォールバック値があるのでエラーを無効化
  if (isDevelopment && firebaseConfig.apiKey && firebaseConfig.projectId) {
    console.log('✅ Firebase設定が完了しています（フォールバック値使用）');
    return true;
  }

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    console.warn('⚠️ 環境変数が設定されていません（フォールバック値を使用）:', missingKeys);
    // フォールバック値があれば有効とする
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      return true;
    }
    console.error('❌ Firebase設定が不完全です:', missingKeys);
    return false;
  }
  
  console.log('✅ Firebase設定が完了しています');
  return true;
} 