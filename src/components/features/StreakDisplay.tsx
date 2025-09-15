'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <Card className="card-zen w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-good-600" aria-label="ストリーク情報を読み込み中"></div>
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
        return 'text-vermillion-600'
      case 'none':
        return 'text-accessible-text-muted'
      default:
        return 'text-accessible-text-muted'
    }
  }

  return (
    <Card className="card-zen w-full">
      <CardHeader>
        <CardTitle className="title-zen flex items-center gap-2">
          <Flame className={`w-5 h-5 ${getStreakColor()}`} aria-hidden="true" />
          ストリーク
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 現在のストリーク */}
        <div className="text-center">
          <div className={`text-5xl font-bold ${getStreakColor()} text-shadow-zen`} aria-label={`現在のストリーク: ${currentStreak}日`}>
            {currentStreak}
          </div>
          <div className="text-sm text-accessible-text-secondary mt-2 font-medium">
            現在のストリーク
          </div>
          <p className={`text-sm mt-3 ${getStreakColor()} leading-relaxed`}>
            {getStreakMessage()}
          </p>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-zen-50 border border-zen-200 rounded-lg transition-all duration-200 hover:bg-zen-100">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-vermillion-500" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-accessible-text-primary mb-1" aria-label={`最長記録: ${longestStreak}日`}>
              {longestStreak}
            </div>
            <div className="text-xs text-accessible-text-secondary font-medium">
              最長記録
            </div>
          </div>

          <div className="text-center p-4 bg-zen-50 border border-zen-200 rounded-lg transition-all duration-200 hover:bg-zen-100">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-indigo-500" aria-hidden="true" />
            </div>
            <div className="text-sm text-accessible-text-primary font-bold mb-1" aria-label={`最後の実行日: ${lastActivityDate ? format(lastActivityDate, 'M月d日') : '未記録'}`}>
              {lastActivityDate 
                ? format(lastActivityDate, 'M/d') 
                : '未記録'
              }
            </div>
            <div className="text-xs text-accessible-text-secondary font-medium">
              最後の実行
            </div>
          </div>
        </div>

        {/* ストリーク維持のヒント */}
        {streakStatus === 'active' && currentStreak >= 3 && (
          <div className="bg-good-50 border border-good-300 rounded-lg p-4 shadow-zen">
            <p className="text-good-700 text-sm text-center font-medium leading-relaxed">
              🎉 素晴らしい！この調子で続けていきましょう！
            </p>
          </div>
        )}

        {streakStatus === 'broken' && currentStreak > 0 && (
          <div className="bg-vermillion-50 border border-vermillion-300 rounded-lg p-4 shadow-zen">
            <p className="text-vermillion-700 text-sm text-center font-medium leading-relaxed">
              💪 大丈夫！今日から新しいストリークを始めましょう！
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}