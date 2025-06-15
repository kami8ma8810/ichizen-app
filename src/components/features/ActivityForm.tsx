'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

interface ActivityFormProps {
  templateId: string
  templateTitle: string
  onSubmit: (data: { note: string; mood: string }) => void
  onCancel: () => void
  isLoading?: boolean
}

const moods = [
  { value: 'EXCELLENT', label: '最高！', emoji: '😊' },
  { value: 'GOOD', label: '良い', emoji: '😌' },
  { value: 'NEUTRAL', label: '普通', emoji: '😐' },
  { value: 'BAD', label: '微妙', emoji: '😞' }
]

export function ActivityForm({ templateTitle, onSubmit, onCancel, isLoading = false }: ActivityFormProps) {
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('GOOD')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ note, mood })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">善行を記録</CardTitle>
        <p className="text-sm text-gray-600 text-center">{templateTitle}</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mood">実行後の気分</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.value}
                  type="button"
                  onClick={() => setMood(moodOption.value)}
                  className={`p-3 rounded-lg border text-sm transition-colors ${
                    mood === moodOption.value
                      ? 'border-good bg-good/10 text-good-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{moodOption.emoji}</div>
                  <div>{moodOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="note">メモ（任意）</Label>
            <Input
              id="note"
              placeholder="今日の善行について何か記録しておきたいことがあれば..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button 
              type="submit" 
              variant="good"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? '記録中...' : '記録する'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}