'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useGoodDeeds } from '@/hooks/useGoodDeeds';
import { GoodDeedCard } from '@/components/features/GoodDeedCard';
import { ActivityForm } from '@/components/features/ActivityForm';
import { StreakDisplay } from '@/components/features/StreakDisplay';
import { Button } from '@/components/ui/Button';

const DashboardPage: FC = () => {
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const { dailyTemplate, todayActivity, isLoading: goodDeedsLoading, error, recordActivity } = useGoodDeeds(user?.uid || null);

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

  const handleCompleteGoodDeed = async () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (data: { note: string; mood: string }) => {
    if (!dailyTemplate) return;
    
    try {
      await recordActivity(dailyTemplate.id, data.note, data.mood);
      setShowForm(false);
    } catch (error) {
      console.error('Record error:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
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
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* ウェルカムメッセージ */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              おかえりなさい、{user.name || 'さん'}！
            </h2>
            <p className="text-gray-600">
              今日も小さな善行から始めましょう
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 善行カードまたはフォーム */}
            <div className="flex justify-center">
              {showForm && dailyTemplate ? (
                <ActivityForm
                  templateId={dailyTemplate.id}
                  templateTitle={dailyTemplate.title}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                  isLoading={goodDeedsLoading}
                />
              ) : (
                <div className="w-full max-w-md">
                  {goodDeedsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-good"></div>
                    </div>
                  ) : dailyTemplate ? (
                    <GoodDeedCard
                      template={dailyTemplate}
                      onComplete={handleCompleteGoodDeed}
                      isCompleted={!!todayActivity}
                      isLoading={goodDeedsLoading}
                    />
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-gray-600">今日の善行テンプレートを読み込み中...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ストリーク表示 */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <StreakDisplay userId={user.uid} />
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => router.push('/calendar')}
              className="mr-4"
            >
              📅 カレンダーを見る
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              🏠 ホームに戻る
            </Button>
          </div>

          {/* 今日の記録状況 */}
          {todayActivity && (
            <div className="bg-good-50 border border-good-200 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-good-800 mb-2">
                  🎉 今日の善行完了！
                </h3>
                <p className="text-good-700 mb-4">
                  {todayActivity.template.title}
                </p>
                {todayActivity.note && (
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      <strong>メモ:</strong> {todayActivity.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 