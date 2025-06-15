'use client'

import { useState, useEffect } from 'react'
import { differenceInDays, startOfDay, subDays } from 'date-fns'

interface Activity {
  id: string
  date: string
  status: string
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date | null
  streakStatus: 'active' | 'broken' | 'none'
}

export function useStreak(userId: string | null) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    streakStatus: 'none'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateStreak = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      
      // 過去3ヶ月分の活動を取得
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      
      const params = new URLSearchParams({
        userId,
        startDate: threeMonthsAgo.toISOString(),
        endDate: new Date().toISOString()
      })

      const response = await fetch(`/api/activities?${params}`)
      if (!response.ok) throw new Error('活動履歴の取得に失敗しました')
      
      const activities: Activity[] = await response.json()
      
      // 完了した活動のみを対象とし、日付順にソート
      const completedActivities = activities
        .filter(activity => activity.status === 'COMPLETED')
        .map(activity => startOfDay(new Date(activity.date)))
        .sort((a, b) => b.getTime() - a.getTime()) // 新しい順
        .filter((date, index, array) => 
          // 重複する日付を除去
          index === 0 || date.getTime() !== array[index - 1]?.getTime()
        )

      if (completedActivities.length === 0) {
        setStreakData({
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          streakStatus: 'none'
        })
        return
      }

      // 現在のストリークを計算
      const today = startOfDay(new Date())
      const yesterday = startOfDay(subDays(today, 1))
      let currentStreak = 0
      let streakStatus: 'active' | 'broken' | 'none' = 'none'

      // 今日または昨日から始まるストリークをチェック
      let checkDate = today
      let activityIndex = 0

      // 今日実行済みかチェック
      if (completedActivities.length > 0 && completedActivities[0]?.getTime() === today.getTime()) {
        currentStreak = 1
        streakStatus = 'active'
        activityIndex = 1
        checkDate = yesterday
      }
      // 昨日実行済みかチェック
      else if (completedActivities.length > 0 && completedActivities[0]?.getTime() === yesterday.getTime()) {
        currentStreak = 1
        streakStatus = 'broken' // 今日やっていないので途切れている
        activityIndex = 1
        checkDate = subDays(yesterday, 1)
      }
      else {
        // 今日も昨日もやっていない場合
        streakStatus = 'broken'
      }

      // 連続した日付をカウント
      while (activityIndex < completedActivities.length) {
        const activityDate = completedActivities[activityIndex]
        
        if (activityDate?.getTime() === checkDate.getTime()) {
          currentStreak++
          checkDate = subDays(checkDate, 1)
          activityIndex++
        } else {
          break
        }
      }

      // 最長ストリークを計算
      let longestStreak = 0
      let tempStreak = 0
      let prevDate: Date | null = null

      completedActivities.forEach(date => {
        if (prevDate === null || differenceInDays(prevDate, date) === 1) {
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          tempStreak = 1
        }
        prevDate = date
      })

      setStreakData({
        currentStreak,
        longestStreak,
        lastActivityDate: completedActivities[0] || null,
        streakStatus
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    calculateStreak()
  }, [userId])

  return {
    ...streakData,
    isLoading,
    error,
    refetch: calculateStreak
  }
}