import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useIsAuthenticated, useAuthLoading, useAuthError } from '@/stores/authStore';
import { authService } from '@/lib/auth';
import { LoginFormData, RegisterFormData } from '@/types/auth';
import { authConfig } from '@/config/firebase';

/**
 * 認証フック - メインの認証機能を提供
 */
export function useAuth() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  // アクションを直接Zustandから取得（無限ループ回避）
  const setLoading = useAuthStore(state => state.setLoading);
  const setError = useAuthStore(state => state.setError);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const clearError = useAuthStore(state => state.clearError);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 注意: Firebase認証状態の監視は AuthProvider で行われています

  // ログイン関数（メール）
  const loginWithEmail = useCallback(async (data: LoginFormData): Promise<boolean> => {
    if (!isClient) return false;
    
    try {
      setLoading(true);
      clearError();
      
      const result = await authService.loginWithEmail(data);
      login(result);
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, setLoading, clearError, login, setError]);

  // 登録関数（メール）
  const registerWithEmail = useCallback(async (data: RegisterFormData): Promise<boolean> => {
    if (!isClient) return false;
    
    try {
      setLoading(true);
      clearError();
      
      const result = await authService.registerWithEmail(data);
      login(result);
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, setLoading, clearError, login, setError]);

  // Googleログイン
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    if (!isClient) return false;
    
    try {
      setLoading(true);
      clearError();
      
      const result = await authService.loginWithGoogle();
      login(result);
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, setLoading, clearError, login, setError]);

  // 匿名ログイン
  const loginAnonymously = useCallback(async (): Promise<boolean> => {
    if (!isClient) return false;
    
    try {
      setLoading(true);
      clearError();
      
      const result = await authService.loginAnonymously();
      login(result);
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, setLoading, clearError, login, setError]);

  // ログアウト
  const logoutUser = useCallback(async (): Promise<boolean> => {
    if (!isClient) return false;
    
    try {
      setLoading(true);
      
      await authService.logout();
      logout();
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, setLoading, logout, setError]);

  // パスワードリセット
  const sendPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    if (!isClient) return false;
    
    try {
      setLoading(true);
      clearError();
      
      await authService.sendPasswordReset(email);
      
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient, setLoading, clearError, setError]);

  return {
    // 状態
    isAuthenticated: isClient ? isAuthenticated : false,
    isLoading: isClient ? isLoading : true,
    error: isClient ? error : null,
    
    // アクション
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginAnonymously,
    logout: logoutUser,
    sendPasswordReset,
    clearError,
  };
}

/**
 * 認証が必要なページで使用するフック
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    // 初回チェック時のみリダイレクト処理を実行
    if (!isLoading && !isChecked) {
      setIsChecked(true);
      
      if (!isAuthenticated) {
        // 未認証の場合はログインページにリダイレクト
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, isChecked, router]);

  return {
    isAuthenticated,
    isLoading,
    shouldShowContent: isAuthenticated && !isLoading && isChecked,
  };
}

/**
 * ログイン済みユーザーをダッシュボードにリダイレクトするフック
 */
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    // 初回チェック時のみリダイレクト処理を実行
    if (!isLoading && !isChecked) {
      setIsChecked(true);
      
      if (isAuthenticated) {
        // 認証済みの場合はダッシュボードにリダイレクト
        router.push(authConfig.redirects.afterSignIn);
      }
    }
  }, [isAuthenticated, isLoading, isChecked, router]);

  return {
    isAuthenticated,
    isLoading,
    shouldShowContent: !isAuthenticated && !isLoading && isChecked,
  };
}

/**
 * 認証プロバイダーの可用性をチェックするフック
 */
export function useAuthProviders() {
  return {
    email: authConfig.providers.email.enabled,
    google: authConfig.providers.google.enabled,
    apple: authConfig.providers.apple.enabled,
    anonymous: authConfig.providers.anonymous.enabled,
  };
}

/**
 * 認証トークンを取得するフック
 */
export function useAuthToken() {
  const getAuthToken = useAuthStore(state => state.getAuthToken);
  
  const getToken = useCallback(async (): Promise<string | null> => {
    return await getAuthToken();
  }, [getAuthToken]);

  return {
    getToken,
  };
} 