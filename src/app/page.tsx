'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const router = useRouter();
  const { loginAnonymously, isLoading, isAuthenticated, error } = useAuth();

  const handleQuickStart = async () => {
    try {
      console.log('🚀 「今すぐ始める」ボタンがクリックされました');
      console.log('📊 現在の認証状態:', { isLoading, isAuthenticated: false });
      
      const success = await loginAnonymously();
      console.log('🔐 匿名ログイン結果:', success);
      
      if (success) {
        console.log('✅ ダッシュボードにリダイレクト開始');
        router.push('/dashboard');
      } else {
        console.error('❌ 匿名ログインに失敗しました');
      }
    } catch (error) {
      console.error('💥 ハンドル処理でエラー:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-zen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="title-zen text-5xl sm:text-7xl text-shadow-zen mb-2">
            <span className="text-good-600">一日一善</span>
          </h1>
          <div className="mt-12 flex items-center justify-center gap-x-6 flex-wrap">
            <button
              onClick={handleQuickStart}
              disabled={isLoading}
              className="btn-zen text-lg px-8 py-4 motion-safe-zen focus-visible-zen disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="今すぐ善行を始める"
            >
              {isLoading ? '準備中...' : '今すぐ始める'}
            </button>
          </div>

          {/* 開発環境でのみ開発者向けリンクを表示 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 space-y-4">
              <div className="bg-gray-100 p-4 rounded text-sm">
                <h3 className="font-semibold mb-2">🔍 デバッグ情報</h3>
                <p>Loading: {isLoading ? 'true' : 'false'}</p>
                <p>Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
                {error && <p className="text-red-600">Error: {error}</p>}
              </div>
              <div>
                <Link
                  href="/dev/qr"
                  className="btn-zen-secondary text-sm motion-safe-zen focus-visible-zen"
                  aria-label="スマートフォンでのテスト用QRコードページへ移動"
                >
                  📱 スマホテスト（QRコード）
                </Link>
              </div>
              <div>
                <Link
                  href="/test-firebase"
                  className="text-xs text-indigo-600 hover:text-indigo-700 focus-visible-zen motion-safe-zen"
                  aria-label="Firebase接続テストページへ移動"
                >
                  🔧 Firebase接続テスト
                </Link>
              </div>
              <div>
                <Link
                  href="/auth/login"
                  className="text-xs text-gray-500 hover:text-gray-700 focus-visible-zen motion-safe-zen"
                  aria-label="開発者向けログインページ"
                >
                  🔐 開発者ログイン
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 