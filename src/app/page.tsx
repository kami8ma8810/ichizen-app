import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-zen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="title-zen text-5xl sm:text-7xl text-shadow-zen mb-2">
            <span className="text-good-600">一日一善</span>
          </h1>
          <p className="subtitle-zen text-xl leading-8 text-accessible-text-secondary mt-8">
            毎日1つの善行で、より良い自分と社会を築こう
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-6 flex-wrap">
            <Link
              href="/auth/login"
              className="btn-zen text-lg px-8 py-4 inline-block motion-safe-zen focus-visible-zen"
              aria-label="ログインして善行を始める"
            >
              始める
            </Link>
            <Link 
              href="/auth/register" 
              className="link-zen text-lg font-medium motion-safe-zen"
              aria-label="新しいアカウントを作成する"
            >
              アカウント作成 <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* 開発環境でのみQRコードページを表示 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8">
              <Link
                href="/dev/qr"
                className="btn-zen-secondary text-sm motion-safe-zen focus-visible-zen"
                aria-label="スマートフォンでのテスト用QRコードページへ移動"
              >
                📱 スマホテスト（QRコード）
              </Link>
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/test-firebase"
              className="text-xs text-indigo-600 hover:text-indigo-700 focus-visible-zen motion-safe-zen"
              aria-label="Firebase接続テストページへ移動"
            >
              🔧 Firebase接続テスト
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 