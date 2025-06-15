'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { QrCode, Smartphone, Wifi, ExternalLink } from 'lucide-react'

export function QRCodeDisplay() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [networkUrl, setNetworkUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateQRCode()
  }, [])

  const generateQRCode = async () => {
    if (process.env.NODE_ENV !== 'development') return

    setIsLoading(true)
    try {
      // 現在のホストを取得
      const host = window.location.host
      const url = `http://${host}`
      setNetworkUrl(url)

      // QRコード生成APIを呼び出し
      const response = await fetch('/api/dev/qr')
      if (response.ok) {
        setQrCodeUrl(`/api/dev/qr?t=${Date.now()}`)
      }
    } catch (error) {
      console.error('QR code generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openQRPage = () => {
    window.open('/api/dev/qr', '_blank')
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <QrCode className="w-5 h-5" />
          📱 モバイルテスト
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="bg-white rounded-lg p-4 mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <iframe
                src={qrCodeUrl}
                className="w-full h-64 border-0 rounded"
                title="QR Code"
              />
            )}
          </div>
          
          {networkUrl && (
            <div className="text-xs font-mono bg-gray-100 p-2 rounded mb-4 break-all">
              {networkUrl}
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <Wifi className="w-4 h-4 mt-0.5 text-blue-500" />
            <span>PCとスマホを同じWiFiに接続</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Smartphone className="w-4 h-4 mt-0.5 text-green-500" />
            <span>スマホでQRコードをスキャン</span>
          </div>
          
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 mt-0.5 text-purple-500" />
            <span>ブラウザでアプリが開きます</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateQRCode}
            disabled={isLoading}
            className="flex-1"
          >
            🔄 更新
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={openQRPage}
            className="flex-1"
          >
            📱 QRページを開く
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          開発環境でのみ表示されます
        </div>
      </CardContent>
    </Card>
  )
}