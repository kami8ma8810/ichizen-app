'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button-zen"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

interface ActivityFormProps {
  template?: {
    id: string
    title: string
    description: string | null
  }
  onSubmit: (data: { title: string; note: string; mood: string }) => void
  onCancel: () => void
  isLoading?: boolean
}

const moods = [
  { value: 'EXCELLENT', label: '最高！', emoji: '😊' },
  { value: 'GOOD', label: '良い', emoji: '😌' },
  { value: 'NEUTRAL', label: '普通', emoji: '😐' },
  { value: 'BAD', label: '微妙', emoji: '😞' }
]

export function ActivityForm({ template, onSubmit, onCancel, isLoading = false }: ActivityFormProps) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('GOOD')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), note, mood })
  }

  return (
    <Card className="card-zen w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="title-zen text-center">善行を記録</CardTitle>
        {template && (
          <p className="text-sm text-accessible-text-secondary text-center font-medium">
            例: {template.title}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="label-zen">今日行った善行 <span className="text-vermillion-500">*</span></Label>
            <Input
              id="title"
              placeholder={template ? `例: ${template.title}` : "今日行った善行を入力してください"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-zen mt-2"
              required
              aria-describedby="title-description"
            />
            <p id="title-description" className="sr-only">今日行った善行の内容を入力してください。必須項目です。</p>
            {template?.description && (
              <p className="text-xs text-accessible-text-muted mt-1 leading-relaxed">
                ヒント: {template.description}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="mood" className="label-zen">実行後の気分</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.value}
                  type="button"
                  onClick={() => setMood(moodOption.value)}
                  className={`p-3 rounded-lg border text-sm transition-all duration-200 focus-visible-zen motion-safe-zen min-h-[44px] ${
                    mood === moodOption.value
                      ? 'border-good-500 bg-good-50 text-good-700 shadow-zen'
                      : 'border-zen-300 hover:border-zen-400 hover:bg-zen-50'
                  }`}
                  aria-pressed={mood === moodOption.value}
                  aria-label={`気分: ${moodOption.label}`}
                >
                  <div className="text-lg mb-1">{moodOption.emoji}</div>
                  <div>{moodOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="note" className="label-zen">詳細メモ（任意）</Label>
            <textarea
              id="note"
              placeholder="どんなことをしたか、どんな気持ちだったかなど、自由に記録してください..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="textarea-zen mt-2"
              rows={3}
              aria-describedby="note-description"
            />
            <p id="note-description" className="sr-only">善行の詳細や感想を記録したいことを入力してください。空欄でも構いません。</p>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 motion-safe-zen focus-visible-zen"
              aria-label="善行の記録をキャンセル"
            >
              キャンセル
            </Button>
            <Button 
              type="submit" 
              variant="default"
              disabled={isLoading || !title.trim()}
              className="flex-1 motion-safe-zen focus-visible-zen"
              aria-label={isLoading ? '善行を記録中' : '善行を記録する'}
            >
              {isLoading ? '記録中...' : '記録する'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}