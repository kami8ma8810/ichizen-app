import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { headers } from 'next/headers'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'この機能は開発環境でのみ利用できます' },
      { status: 403 }
    )
  }

  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3001'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const url = `${protocol}://${host}`

    // QRコードを生成
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // HTMLページとして返す
    const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌱 一日一善アプリ - QRコード</title>
        <style>
            body {
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 100%;
            }
            h1 {
                color: #16a34a;
                margin: 0 0 10px 0;
                font-size: 24px;
            }
            .subtitle {
                color: #6b7280;
                margin: 0 0 30px 0;
                font-size: 16px;
            }
            .qr-container {
                margin: 20px 0;
                padding: 20px;
                background: #f9fafb;
                border-radius: 12px;
            }
            .url {
                font-family: monospace;
                background: #f3f4f6;
                padding: 12px;
                border-radius: 8px;
                margin: 20px 0;
                word-break: break-all;
                font-size: 14px;
                color: #374151;
            }
            .instructions {
                color: #6b7280;
                font-size: 14px;
                line-height: 1.5;
                margin-top: 20px;
            }
            .refresh {
                margin-top: 20px;
            }
            .refresh button {
                background: #16a34a;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
            }
            .refresh button:hover {
                background: #15803d;
            }
            .network-info {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 12px;
                margin: 20px 0;
                font-size: 13px;
                color: #92400e;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌱 一日一善アプリ</h1>
            <p class="subtitle">スマホでQRコードをスキャン</p>
            
            <div class="qr-container">
                <img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 100%; height: auto;" />
            </div>
            
            <div class="url">${url}</div>
            
            <div class="network-info">
                📱 スマホとPCが同じWiFiに接続されている必要があります
            </div>
            
            <div class="instructions">
                <strong>使い方:</strong><br>
                1. スマホのカメラアプリでQRコードをスキャン<br>
                2. ブラウザでアプリが開きます<br>
                3. ホーム画面に追加すればアプリのように使えます
            </div>
            
            <div class="refresh">
                <button onclick="window.location.reload()">
                    🔄 QRコードを更新
                </button>
            </div>
        </div>
        
        <script>
            // 自動更新は無効化（手動更新ボタンのみ）
            console.log('QRコードページが読み込まれました');
        </script>
    </body>
    </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'QRコードの生成に失敗しました' },
      { status: 500 }
    )
  }
}