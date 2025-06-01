'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

const DashboardPage: FC = () => {
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  // 認証チェック
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else {
        setIsPageLoading(false);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async (): Promise<void> => {
    const success = await logout();
    if (success) {
      router.push('/');
    }
  };

  if (isPageLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Ichizen Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.image && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.image}
                    alt={user.name || 'User'}
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 ログイン成功！
              </h2>
              <p className="text-gray-600 mb-8">
                Firebase認証が正常に動作しています
              </p>

              {/* ユーザー情報カード */}
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ユーザー情報
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">名前:</dt>
                    <dd className="text-sm text-gray-900">
                      {user.name || '未設定'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">メール:</dt>
                    <dd className="text-sm text-gray-900">
                      {user.email || '未設定'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">UID:</dt>
                    <dd className="text-sm text-gray-900 font-mono">
                      {user.uid.slice(0, 8)}...
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">認証済み:</dt>
                    <dd className="text-sm">
                      {user.emailVerified ? (
                        <span className="text-green-600">✅ 済み</span>
                      ) : (
                        <span className="text-yellow-600">⚠️ 未確認</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">作成日:</dt>
                    <dd className="text-sm text-gray-900">
                      {user.createdAt.toLocaleDateString('ja-JP')}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* アクションボタン */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => alert('一日一善機能は開発中です！')}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  今日の善行を記録する
                </button>
                
                <div className="mt-4">
                  <a
                    href="/"
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  >
                    ← ホームに戻る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 