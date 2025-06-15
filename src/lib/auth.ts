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
      const provider = new GoogleAuthProvider();
      // Google認証のスコープ設定
      authConfig.providers.google.scopes.forEach(scope => {
        provider.addScope(scope);
      });

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
      const userCredential = await signInAnonymously(this.auth);
      const user = mapFirebaseUser(userCredential.user);
      
      return {
        user,
        isNewUser: true,
        provider: 'anonymous',
      };
    } catch (error) {
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
    this.unsubscribe = onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
      callback(user);
    });

    return () => {
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