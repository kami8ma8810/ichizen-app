'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/lib/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser)
  const setLoading = useAuthStore(state => state.setLoading)

  useEffect(() => {
    let mounted = true;
    
    // Zustandストアのハイドレーション
    if (typeof window !== 'undefined' && useAuthStore.persist?.hasHydrated && !useAuthStore.persist.hasHydrated()) {
      console.log('🔄 Zustandストアをハイドレーション中...')
      useAuthStore.persist.rehydrate()
    }

    // 初期loading状態の設定（Firebase認証状態確認開始）
    setLoading(true)

    // Firebase認証状態の監視
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (!mounted) return; // コンポーネントがアンマウントされている場合は何もしない
      console.log('🔄 Firebase認証状態変更:', user ? `ログイン中 (${user.email || user.uid})` : 'ログアウト')
      
      // まず認証状態を即座に更新（API呼び出しを待たない）
      setUser(user)
      setLoading(false)
      
      // ユーザーがログインしている場合のみ、バックグラウンドでデータベース同期
      if (user) {
        try {
          const response = await fetch('/api/users/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              firebaseUid: user.uid,
              email: user.email,
              name: user.name,
              image: user.image
            })
          })

          if (!response.ok) {
            console.warn('⚠️ ユーザー同期に失敗しました:', response.statusText)
          } else {
            const dbUser = await response.json()
            console.log('✅ ユーザー同期完了:', dbUser.id)
          }
        } catch (error) {
          console.warn('⚠️ ユーザー同期エラー（続行）:', error)
          // エラーが発生してもアプリの動作は継続
        }
      }
    })

    return () => {
      mounted = false;
      unsubscribe()
    }
  }, [setUser, setLoading])

  return <>{children}</>
}