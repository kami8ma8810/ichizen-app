'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useStreak } from '@/hooks/useStreak'
import { Flame, Trophy, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface StreakDisplayProps {
  userId: string
}

export function StreakDisplay({ userId }: StreakDisplayProps) {
  const { 
    currentStreak, 
    longestStreak, 
    lastActivityDate, 
    streakStatus, 
    isLoading 
  } = useStreak(userId)

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-good"></div>
        </CardContent>
      </Card>
    )
  }

  const getStreakMessage = () => {
    switch (streakStatus) {
      case 'active':
        return currentStreak === 1 
          ? '今日も善行を実行しました！' 
          : `${currentStreak}日連続で実行中です！`
      case 'broken':
        return currentStreak > 0 
          ? `${currentStreak}日継続していましたが、途切れてしまいました。また今日から始めましょう！`
          : '今日から新しいストリークを始めましょう！'
      case 'none':
        return '最初の善行を記録して、ストリークを始めましょう！'
      default:
        return ''
    }
  }

  const getStreakColor = () => {
    switch (streakStatus) {
      case 'active':
        return 'text-good-600'
      case 'broken':
        return 'text-orange-600'
      case 'none':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${getStreakColor()}`} />
          ストリーク
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 現在のストリーク */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getStreakColor()}`}>
            {currentStreak}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            現在のストリーク
          </div>
          <p className={`text-sm mt-2 ${getStreakColor()}`}>
            {getStreakMessage()}
          </p>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {longestStreak}
            </div>
            <div className="text-xs text-gray-600">
              最長記録
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-900 font-medium">
              {lastActivityDate 
                ? format(lastActivityDate, 'M/d') 
                : '未記録'
              }
            </div>
            <div className="text-xs text-gray-600">
              最後の実行
            </div>
          </div>
        </div>

        {/* ストリーク維持のヒント */}
        {streakStatus === 'active' && currentStreak >= 3 && (
          <div className="bg-good-50 border border-good-200 rounded-lg p-3">
            <p className="text-good-800 text-sm text-center">
              🎉 素晴らしい！この調子で続けていきましょう！
            </p>
          </div>
        )}

        {streakStatus === 'broken' && currentStreak > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-800 text-sm text-center">
              💪 大丈夫！今日から新しいストリークを始めましょう！
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}