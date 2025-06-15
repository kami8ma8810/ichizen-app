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
    // Zustandストアのハイドレーション
    if (typeof window !== 'undefined' && useAuthStore.persist?.hasHydrated && !useAuthStore.persist.hasHydrated()) {
      useAuthStore.persist.rehydrate()
    }

    // Firebase認証状態の監視
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        // ユーザーがログインしている場合、データベースと同期
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
            console.error('ユーザー同期に失敗しました:', response.statusText)
          } else {
            const dbUser = await response.json()
            console.log('✅ ユーザー同期完了:', dbUser.id)
          }
        } catch (error) {
          console.error('ユーザー同期エラー:', error)
        }
      }
      
      setUser(user)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser, setLoading])

  return <>{children}</>
}