'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/Calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useActivities } from '@/hooks/useActivities'
import { addMonths, subMonths, format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActivityCalendarProps {
  userId: string
}

export function ActivityCalendar({ userId }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { completedDates, isLoading } = useActivities(userId, currentDate)

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleDateClick = (date: Date) => {
    // 将来的にその日の詳細を表示する機能を追加可能
    console.log('Selected date:', date)
  }

  const completedCount = completedDates.length
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const completionRate = daysInMonth > 0 ? Math.round((completedCount / daysInMonth) * 100) : 0

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
            disabled={isLoading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <CardTitle className="text-lg">
            {format(currentDate, 'yyyy年M月')}
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            disabled={isLoading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            今月の実行日数: <span className="font-semibold text-good">{completedCount}日</span>
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-good h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              達成率: {completionRate}%
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-good"></div>
          </div>
        ) : (
          <Calendar
            currentDate={currentDate}
            completedDates={completedDates}
            onDateClick={handleDateClick}
          />
        )}
      </CardContent>
    </Card>
  )
}