import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User, AuthState, AuthResult } from '@/types/auth';
import { useMemo } from 'react';

interface AuthStore extends AuthState {
  // アクション
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (result: AuthResult) => void;
  logout: () => void;
  clearError: () => void;
  updateUserSettings: (settings: Partial<User['settings']>) => void;
  
  // ユーティリティ
  getAuthToken: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
}

/**
 * 認証状態管理ストア
 * Zustand + Immer + 永続化を使用
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      // 初期状態
      user: null,
      isLoading: true, // 初期状態では認証チェック中
      isAuthenticated: false,
      error: null,

      // ユーザー設定
      setUser: (user: User | null) => {
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
          state.error = null;
        });
      },

      // ローディング状態設定
      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      // エラー設定
      setError: (error: string | null) => {
        set((state) => {
          state.error = error;
        });
      },

      // ログイン処理
      login: (result: AuthResult) => {
        set((state) => {
          state.user = result.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });

        // ログイン成功のログ
        console.log(`✅ ログイン成功 (${result.provider}):`, result.user.name || result.user.email);
      },

      // ログアウト処理
      logout: () => {
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });

        console.log('👋 ログアウトしました');
      },

      // エラークリア
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      // ユーザー設定更新
      updateUserSettings: (settings: Partial<User['settings']>) => {
        set((state) => {
          if (state.user) {
            state.user.settings = {
              ...state.user.settings,
              ...settings,
            };
          }
        });
      },

      // Firebase認証トークン取得
      getAuthToken: async (): Promise<string | null> => {
        try {
          const { getFirebaseAuth } = await import('@/lib/firebase');
          const auth = getFirebaseAuth();
          const currentUser = auth.currentUser;
          
          if (!currentUser) {
            return null;
          }

          const token = await currentUser.getIdToken();
          return token;
        } catch (error) {
          console.error('❌ 認証トークン取得エラー:', error);
          return null;
        }
      },

      // ユーザー情報リフレッシュ
      refreshUser: async (): Promise<void> => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          const { getFirebaseAuth } = await import('@/lib/firebase');
          const { mapFirebaseUser } = await import('@/types/auth');
          
          const auth = getFirebaseAuth();
          const currentUser = auth.currentUser;

          if (currentUser) {
            // ユーザー情報を最新の状態に更新
            await currentUser.reload();
            const updatedUser = mapFirebaseUser(currentUser);
            
            set((state) => {
              state.user = updatedUser;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } else {
            // ユーザーが存在しない場合はログアウト状態に
            get().logout();
          }
        } catch (error) {
          console.error('❌ ユーザー情報リフレッシュエラー:', error);
          set((state) => {
            state.isLoading = false;
            state.error = 'ユーザー情報の更新に失敗しました';
          });
        }
      },
    })),
    {
      name: 'ichizen-auth-storage', // ストレージキー
      storage: createJSONStorage(() => {
        // SSR対応: サーバーサイドでは undefined を返す
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      // 永続化対象のフィールドを限定（セキュリティ考慮）
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // ハイドレーション時のスキップ（SSR問題回避）
      skipHydration: true,
      // ストレージからの復元時の処理
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // クライアントサイドでのみ実行
          state.refreshUser().catch((error) => {
            console.warn('⚠️ ユーザー情報の自動リフレッシュに失敗:', error);
          });
        }
      },
    }
  )
);

// 安定化されたセレクター関数（メモ化）
const selectUser = (state: AuthStore) => state.user;
const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
const selectIsLoading = (state: AuthStore) => state.isLoading;
const selectError = (state: AuthStore) => state.error;

// セレクター（パフォーマンス最適化）
export const useUser = () => useAuthStore(selectUser);
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
export const useAuthLoading = () => useAuthStore(selectIsLoading);
export const useAuthError = () => useAuthStore(selectError);

// アクションセレクター（完全にメモ化）
export const useAuthActions = () => {
  return useMemo(() => {
    const store = useAuthStore.getState();
    return {
      setUser: store.setUser,
      setLoading: store.setLoading,
      setError: store.setError,
      login: store.login,
      logout: store.logout,
      clearError: store.clearError,
      updateUserSettings: store.updateUserSettings,
      getAuthToken: store.getAuthToken,
      refreshUser: store.refreshUser,
    };
  }, []);
}; 