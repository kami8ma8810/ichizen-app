import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User as FirebaseUser
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { 
  User, 
  AuthResult, 
  AuthError, 
  LoginFormData, 
  RegisterFormData,
  mapFirebaseUser 
} from '@/types/auth';
import { authConfig } from '@/config/firebase';
import { getGoogleAuthConfig, logDevelopmentInfo } from './firebase-dev';

/**
 * 認証サービスクラス
 * Firebase Authとアプリケーション状態を管理
 */
export class AuthService {
  private auth = getFirebaseAuth();
  private unsubscribe: (() => void) | null = null;

  /**
   * Firebase認証エラーを日本語メッセージに変換
   */
  private translateAuthError(error: any): AuthError {
    const code = error?.code || 'auth/unknown-error';
    const message = authConfig.errorMessages[code as keyof typeof authConfig.errorMessages] 
      || 'ログインに失敗しました。再度お試しください。';

    return {
      code,
      message,
      details: error,
    };
  }

  /**
   * メールアドレスとパスワードでログイン
   */
  async loginWithEmail(data: LoginFormData): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      const user = mapFirebaseUser(userCredential.user);
      
      return {
        user,
        isNewUser: false,
        provider: 'email',
      };
    } catch (error) {
      throw this.translateAuthError(error);
    }
  }

  /**
   * メールアドレスとパスワードで新規登録
   */
  async registerWithEmail(data: RegisterFormData): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      // プロフィール更新（表示名を設定）
      if (data.name) {
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });
      }

      // メール認証を送信
      await sendEmailVerification(userCredential.user);

      const user = mapFirebaseUser(userCredential.user);
      
      return {
        user,
        isNewUser: true,
        provider: 'email',
      };
    } catch (error) {
      throw this.translateAuthError(error);
    }
  }

  /**
   * Googleアカウントでログイン
   */
  async loginWithGoogle(): Promise<AuthResult> {
    try {
      // 開発環境の情報をログ出力
      if (process.env.NODE_ENV === 'development') {
        logDevelopmentInfo();
      }

      const provider = new GoogleAuthProvider();
      // Google認証のスコープ設定
      authConfig.providers.google.scopes.forEach(scope => {
        provider.addScope(scope);
      });

      // 開発環境用の追加設定
      const googleConfig = getGoogleAuthConfig();
      if (googleConfig.customParameters) {
        provider.setCustomParameters(googleConfig.customParameters);
      }

      const userCredential = await signInWithPopup(this.auth, provider);
      const user = mapFirebaseUser(userCredential.user);
      
      return {
        user,
        isNewUser: userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime,
        provider: 'google',
      };
    } catch (error) {
      throw this.translateAuthError(error);
    }
  }

  /**
   * 匿名ログイン
   */
  async loginAnonymously(): Promise<AuthResult> {
    try {
      console.log('🔄 Firebase匿名ログインを実行中...');
      console.log('📊 Firebase Auth インスタンス:', this.auth);
      
      const userCredential = await signInAnonymously(this.auth);
      console.log('✅ Firebase匿名ログイン成功:', userCredential.user.uid);
      
      const user = mapFirebaseUser(userCredential.user);
      console.log('✅ ユーザーマッピング完了:', user);
      
      const result = {
        user,
        isNewUser: true,
        provider: 'anonymous' as const,
      };
      
      console.log('✅ AuthResult作成完了:', result);
      return result;
    } catch (error) {
      console.error('❌ Firebase匿名ログインエラー:', error);
      throw this.translateAuthError(error);
    }
  }

  /**
   * ログアウト
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('❌ ログアウトエラー:', error);
      throw this.translateAuthError(error);
    }
  }

  /**
   * パスワードリセットメール送信
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw this.translateAuthError(error);
    }
  }

  /**
   * 現在のユーザー取得
   */
  getCurrentUser(): User | null {
    const firebaseUser = this.auth.currentUser;
    return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * 認証トークン取得
   */
  async getIdToken(): Promise<string | null> {
    try {
      const currentUser = this.auth.currentUser;
      return currentUser ? await currentUser.getIdToken() : null;
    } catch (error) {
      console.error('❌ トークン取得エラー:', error);
      return null;
    }
  }

  /**
   * 認証状態の監視を開始
   * @param callback 認証状態変更時のコールバック
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    console.log('🔄 Firebase認証状態監視を開始...');
    
    let hasInitialStateSet = false;
    
    // 初期認証状態のタイムアウト処理（5秒）
    const initialTimeout = setTimeout(() => {
      if (!hasInitialStateSet) {
        console.warn('⚠️ Firebase認証初期化タイムアウト - 未認証として処理');
        hasInitialStateSet = true;
        callback(null);
      }
    }, 5000);
    
    this.unsubscribe = onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (!hasInitialStateSet) {
        clearTimeout(initialTimeout);
        hasInitialStateSet = true;
      }
      
      const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
      console.log('📡 Firebase認証状態変更検知:', user ? `UID: ${user.uid}` : 'ログアウト');
      callback(user);
    });

    return () => {
      clearTimeout(initialTimeout);
      this.unsubscribe?.();
      this.unsubscribe = null;
    };
  }

  /**
   * 認証状態監視のクリーンアップ
   */
  cleanup(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}

// シングルトンインスタンスを作成
export const authService = new AuthService();

/**
 * 認証プロバイダーごとのログイン関数
 */
export const loginProviders = {
  email: (data: LoginFormData) => authService.loginWithEmail(data),
  google: () => authService.loginWithGoogle(),
  anonymous: () => authService.loginAnonymously(),
} as const;

/**
 * バリデーションヘルパー
 */
export const authValidators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password: string): boolean => {
    return password.length >= 6;
  },
  
  passwordConfirmation: (password: string, confirmation: string): boolean => {
    return password === confirmation;
  },
} as const; 