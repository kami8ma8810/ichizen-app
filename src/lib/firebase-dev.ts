// 開発環境用のFirebase設定とヘルパー

import { connectAuthEmulator } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'

/**
 * 開発環境用のFirebase設定を適用
 */
export function setupDevelopmentFirebase() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const auth = getFirebaseAuth()
  
  // 開発環境でのみエミュレーター接続を試行
  try {
    // ローカルのFirebaseエミュレーターに接続
    // 注意: エミュレーター未起動の場合はスキップ
    const emulatorHost = 'http://localhost:9099'
    
    // エミュレーターが起動しているかチェック
    fetch(emulatorHost)
      .then(() => {
        console.log('🔧 Firebase Auth エミュレーターに接続中...')
        connectAuthEmulator(auth, emulatorHost, { disableWarnings: true })
        console.log('✅ Firebase Auth エミュレーターに接続しました')
      })
      .catch(() => {
        console.log('📡 Firebase本番環境を使用します（エミュレーター未起動）')
      })
  } catch (error) {
    console.log('📡 Firebase本番環境を使用します:', error instanceof Error ? error.message : 'Unknown error')
  }
}

/**
 * 開発環境用のGoogleログイン設定
 */
export function getGoogleAuthConfig() {
  if (process.env.NODE_ENV === 'development') {
    return {
      // 開発環境では localhost を許可
      customParameters: {
        prompt: 'select_account',
        // localhost での動作を許可
        redirect_uri: window.location.origin,
      },
      // ポップアップサイズを調整
      popup: {
        width: 500,
        height: 600,
      }
    }
  }
  
  return {}
}

/**
 * 開発環境でのデバッグログ
 */
export function logDevelopmentInfo() {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 開発環境での認証情報:')
    console.log('  Origin:', window.location.origin)
    console.log('  Host:', window.location.host)
    console.log('  Protocol:', window.location.protocol)
    console.log('  Firebase Auth Domain:', process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'])
  }
}