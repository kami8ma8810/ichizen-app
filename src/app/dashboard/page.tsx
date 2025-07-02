'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useGoodDeeds } from '@/hooks/useGoodDeeds';
import { QuickGoodDeedForm } from '@/components/features/QuickGoodDeedForm';
import { StreakDisplay } from '@/components/features/StreakDisplay';
import { Button } from '@/components/ui/Button-zen';
import { QRCodeDisplay } from '@/components/dev/QRCode';
import { Calendar } from '@/components/ui/Calendar';
import { format, parseISO } from 'date-fns';

const DashboardPage: FC = () => {
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  // showFormステートは不要になったので削除
  
  const { dailyTemplate, recommendations, todayActivity, isLoading: goodDeedsLoading, error, recordActivity } = useGoodDeeds(user?.uid || null);

  // 認証チェック
  useEffect(() => {
    console.log('📊 ダッシュボード認証チェック:', { isLoading, isAuthenticated, user: user?.uid });
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('❌ 未認証のためホームページにリダイレクト');
        router.push('/');
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

  // handleCompleteGoodDeedは不要になったので削除

  const handleFormSubmit = async (data: { title: string; note: string; mood: string }) => {
    try {
      // 自由記入なので、テンプレートIDは使わず、カスタムタイトルを使用
      await recordActivity(null, data.note, data.mood, data.title);
    } catch (error) {
      console.error('Record error:', error);
    }
  };

  // handleFormCancelは不要になったので削除

  if (isPageLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zen-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" aria-label="ダッシュボードを読み込み中"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-zen">
      {/* ヘッダー */}
      <header className="header-zen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="title-zen text-3xl">
                一善ダッシュボード
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.image && (
                  <img
                    className="h-10 w-10 rounded-full border-2 border-zen-300 shadow-zen"
                    src={user.image}
                    alt={user.name || 'ユーザー'}
                  />
                )}
                {(user.name || user.email) && (
                  <span className="text-sm font-medium text-accessible-text-secondary">
                    {user.name || user.email}
                  </span>
                )}
              </div>
              {/* 匿名ユーザー以外にログアウトボタンを表示 */}
              {(user.name || user.email) && (
                <Button
                  onClick={handleLogout}
                  variant="indigo"
                  size="sm"
                  className="motion-safe-zen focus-visible-zen"
                  aria-label="アカウントからログアウトする"
                >
                  ログアウト
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* ウェルカムメッセージ */}
          <div className="text-center">
            <h2 className="subtitle-zen text-2xl mb-3">
              {user.name || user.email ? `おかえりなさい、${user.name || user.email}！` : '今日も善行を始めましょう'}
            </h2>
            <p className="text-accessible-text-secondary leading-relaxed">
              {user.name || user.email ? '今日も小さな善行から始めましょう' : '小さな一歩が、大きな変化を生み出します'}
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 shadow-zen" role="alert">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* メインコンテンツ */}
          <div className="space-y-8">
            {/* 善行記録フォーム */}
            <div className="flex justify-center">
              <QuickGoodDeedForm
                todayActivity={todayActivity}
                template={dailyTemplate || undefined}
                recommendations={recommendations}
                onSubmit={handleFormSubmit}
                isLoading={goodDeedsLoading}
              />
            </div>

            {/* ステータスグリッド */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* ストリーク表示 */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <StreakDisplay userId={user.uid} />
                </div>
              </div>

              {/* 開発環境でのみQRコード表示 */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <QRCodeDisplay />
                </div>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="text-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/calendar')}
              className="motion-safe-zen focus-visible-zen"
              aria-label="カレンダーページへ移動"
            >
              📅 カレンダーを見る
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="motion-safe-zen focus-visible-zen"
              aria-label="ホームページへ戻る"
            >
              🏠 ホームに戻る
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 