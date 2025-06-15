'use client'

import { useState, useEffect } from 'react'

interface GoodDeedTemplate {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string | null
}

interface Activity {
  id: string
  userId: string
  templateId: string | null
  date: string
  status: string
  note: string | null
  mood: string | null
  customTitle?: string | null
  template?: {
    title: string
    category: string
    difficulty: string
  }
}

export function useGoodDeeds(userId: string | null) {
  const [dailyTemplate, setDailyTemplate] = useState<GoodDeedTemplate | null>(null)
  const [todayActivity, setTodayActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 今日の善行テンプレートを取得
  const fetchDailyTemplate = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/templates/daily')
      if (!response.ok) throw new Error('テンプレートの取得に失敗しました')
      const template = await response.json()
      setDailyTemplate(template)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 今日の活動を取得
  const fetchTodayActivity = async () => {
    if (!userId) return
    
    try {
      const response = await fetch(`/api/activities/today?userId=${userId}`)
      if (!response.ok) throw new Error('今日の活動取得に失敗しました')
      const activity = await response.json()
      setTodayActivity(activity)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  // 善行を記録
  const recordActivity = async (templateId: string | null, note: string, mood: string, customTitle?: string) => {
    if (!userId) throw new Error('ユーザーIDが必要です')
    
    try {
      setIsLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          templateId,
          date: today.toISOString(),
          note: note || null,
          mood,
          customTitle: customTitle || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '記録に失敗しました')
      }

      const activity = await response.json()
      setTodayActivity(activity)
      return activity
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // 初期化
  useEffect(() => {
    fetchDailyTemplate()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchTodayActivity()
    }
  }, [userId])

  return {
    dailyTemplate,
    todayActivity,
    isLoading,
    error,
    recordActivity,
    refetch: () => {
      fetchDailyTemplate()
      if (userId) fetchTodayActivity()
    }
  }
}