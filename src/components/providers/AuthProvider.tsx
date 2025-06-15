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
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [setUser, setLoading])

  return <>{children}</>
}