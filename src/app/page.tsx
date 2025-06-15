import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          <span className="text-good-600">一日一善</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          毎日1つの善行で、より良い自分と社会を築こう
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap">
          <Link
            href="/auth/login"
            className="rounded-md bg-good-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-good-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-good-600"
          >
            始める
          </Link>
          <Link 
            href="/auth/register" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-good-600"
          >
            アカウント作成 <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 開発環境でのみQRコードページを表示 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <Link
              href="/dev/qr"
              className="inline-flex items-center rounded-md bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              📱 スマホテスト（QRコード）
            </Link>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/test-firebase"
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            🔧 Firebase接続テスト
          </Link>
        </div>
      </div>
    </div>
  );
} 