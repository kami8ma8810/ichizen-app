'use client'

import { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth } from 'date-fns'

interface Activity {
  id: string
  userId: string
  templateId: string
  date: string
  status: string
  note: string | null
  mood: string | null
  template: {
    title: string
    category: string
    difficulty: string
  }
}

export function useActivities(userId: string | null, currentDate: Date = new Date()) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    if (!userId) return
    
    try {
      setIsLoading(true)
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      
      const params = new URLSearchParams({
        userId,
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString()
      })

      const response = await fetch(`/api/activities?${params}`)
      if (!response.ok) throw new Error('活動履歴の取得に失敗しました')
      
      const data = await response.json()
      setActivities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [userId, currentDate])

  // 完了日の配列を取得
  const getCompletedDates = (): Date[] => {
    return activities
      .filter(activity => activity.status === 'COMPLETED')
      .map(activity => new Date(activity.date))
  }

  return {
    activities,
    isLoading,
    error,
    completedDates: getCompletedDates(),
    refetch: fetchActivities
  }
}