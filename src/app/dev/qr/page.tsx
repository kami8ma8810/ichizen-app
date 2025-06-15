'use client'

import { QRCodeDisplay } from '@/components/dev/QRCode'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QRCodePage() {
  const router = useRouter()

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            開発環境でのみ利用可能
          </h1>
          <p className="text-gray-600 mb-8">
            この機能は開発環境でのみ表示されます。
          </p>
          <Button onClick={() => router.push('/')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ホーム
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                📱 モバイルテスト
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              開発環境
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* 説明 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🌱 一日一善アプリ
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              スマホでQRコードをスキャンしてアクセス
            </p>
            <p className="text-sm text-gray-500">
              PCとスマホが同じWiFiネットワークに接続されている必要があります
            </p>
          </div>

          {/* QRコード表示 */}
          <div className="flex justify-center">
            <QRCodeDisplay />
          </div>

          {/* 使い方 */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 使い方
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <span>PCとスマホを同じWiFiネットワークに接続</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <span>スマホのカメラアプリでQRコードをスキャン</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <span>ブラウザでアプリが自動で開きます</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                <span>スマホでアプリをテストしてください</span>
              </div>
            </div>
          </div>

          {/* 開発者向け情報 */}
          <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🛠 開発者向け情報
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>モバイル開発サーバー:</strong> <code className="bg-gray-200 px-2 py-1 rounded">pnpm run dev:mobile</code></p>
              <p><strong>通常開発サーバー:</strong> <code className="bg-gray-200 px-2 py-1 rounded">pnpm dev</code></p>
              <p><strong>本番ビルド:</strong> <code className="bg-gray-200 px-2 py-1 rounded">pnpm build</code></p>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="text-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/auth/login')}
            >
              ログイン画面
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/auth/register')}
            >
              アカウント作成
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}