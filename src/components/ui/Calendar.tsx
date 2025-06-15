import * as React from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface CalendarProps {
  currentDate?: Date
  completedDates?: Date[]
  onDateClick?: (date: Date) => void
  className?: string
}

export function Calendar({ 
  currentDate = new Date(), 
  completedDates = [], 
  onDateClick,
  className 
}: CalendarProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const isCompleted = (date: Date) => {
    return completedDates.some(completedDate => isSameDay(date, completedDate))
  }

  return (
    <div className={cn("card-zen p-6", className)}>
      <div className="text-center mb-6">
        <h2 className="title-zen text-xl">
          {format(currentDate, "yyyy年M月")}
        </h2>
      </div>
      
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div 
            key={day} 
            className={cn(
              "h-10 flex items-center justify-center text-sm font-medium",
              index === 0 ? "text-vermillion-500" : index === 6 ? "text-indigo-500" : "text-accessible-text-secondary"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const isDayCompleted = isCompleted(day)
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className={cn(
                "h-12 w-12 rounded-lg text-sm font-medium transition-all duration-200 relative motion-safe-zen",
                "hover:bg-zen-100 hover:shadow-zen focus-visible-zen",
                {
                  "text-accessible-text-muted": !isCurrentMonth,
                  "bg-indigo-500 text-white shadow-zen ring-2 ring-indigo-200": isDayToday && !isDayCompleted,
                  "bg-good-600 text-white shadow-zen-lg": isDayCompleted,
                  "opacity-50": !isCurrentMonth,
                }
              )}
              aria-label={`${format(day, "M月d日")}${isDayCompleted ? "（善行完了）" : isDayToday ? "（今日）" : ""}`}
            >
              {format(day, "d")}
              {isDayCompleted && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full shadow-sm" />
              )}
              {isDayToday && !isDayCompleted && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}