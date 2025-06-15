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
    <div className={cn("p-4", className)}>
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "yyyy年M月")}
        </h2>
      </div>
      
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div 
            key={day} 
            className={cn(
              "h-8 flex items-center justify-center text-xs font-medium",
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-600"
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
                "h-10 w-10 rounded-lg text-sm transition-colors relative",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                {
                  "text-muted-foreground": !isCurrentMonth,
                  "bg-primary text-primary-foreground": isDayToday && !isDayCompleted,
                  "bg-good text-white": isDayCompleted,
                  "opacity-50": !isCurrentMonth,
                }
              )}
            >
              {format(day, "d")}
              {isDayCompleted && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}