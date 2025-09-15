'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button-zen'
import { Plus, Sparkles } from 'lucide-react'
// import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react' // 今日のおすすめ機能用

interface QuickGoodDeedFormProps {
  todayActivity?: {
    customTitle?: string | null
    template?: { title: string } | null
    note?: string | null
    mood?: string | null
  } | null
  template?: {
    id: string
    title: string
    description: string | null
  } | undefined
  recommendations?: {
    id: string
    title: string
    description: string | null
    category: string
    difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  }[]
  onSubmit: (data: { title: string; note: string; mood: string }) => void
  isLoading?: boolean
}

const moods = [
  { value: 'EXCELLENT', label: '最高！', emoji: '😊', color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:border-green-300' },
  { value: 'GOOD', label: '良い', emoji: '😌', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300' },
  { value: 'NEUTRAL', label: '普通', emoji: '😐', color: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300' },
  { value: 'BAD', label: '微妙', emoji: '😞', color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:border-orange-300' }
]

export function QuickGoodDeedForm({ todayActivity, template: _template, recommendations: _recommendations = [], onSubmit, isLoading = false }: QuickGoodDeedFormProps) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('GOOD')
  // const [showSuggestion, setShowSuggestion] = useState(false) // 今日のおすすめ機能用
  // const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0) // 今日のおすすめ機能用

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), note, mood })
    // フォームをリセット
    setTitle('')
    setNote('')
    setMood('GOOD')
  }

  // 今日のおすすめ機能用
  /* const handleSuggestionClick = (selectedTemplate?: typeof template) => {
    const targetTemplate = selectedTemplate || getCurrentRecommendation()
    if (targetTemplate) {
      setTitle(targetTemplate.title)
      setShowSuggestion(false)
    }
  } */

  // 今日のおすすめ機能用
  /* const getCurrentRecommendation = () => {
    if (recommendations.length > 0) {
      return recommendations[currentRecommendationIndex]
    }
    return template
  } */

  // 今日のおすすめ機能用
  /* const goToNextRecommendation = () => {
    if (recommendations.length > 0) {
      setCurrentRecommendationIndex((prev) => (prev + 1) % recommendations.length)
    }
  }

  const goToPrevRecommendation = () => {
    if (recommendations.length > 0) {
      setCurrentRecommendationIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length)
    }
  } */

  // 既に完了している場合の表示
  if (todayActivity) {
    return (
      <Card className="card-zen w-full max-w-lg mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-good-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-good-600" />
            </div>
            <h3 className="subtitle-zen text-xl mb-2 text-good-700">
              🎉 今日の善行完了！
            </h3>
            <p className="text-lg font-medium text-accessible-text-primary mb-2">
              {todayActivity.customTitle || todayActivity.template?.title || '善行を実行しました'}
            </p>
            {todayActivity.note && (
              <div className="bg-zen-50 rounded-lg p-4 mt-4 text-left">
                <p className="text-sm text-accessible-text-secondary mb-1 font-medium">記録:</p>
                <p className="text-accessible-text-primary leading-relaxed">
                  {todayActivity.note}
                </p>
              </div>
            )}
            <p className="text-sm text-accessible-text-muted mt-4">
              明日も善行を続けましょう！
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-zen w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="title-zen text-center flex items-center justify-center gap-2">
          <Plus className="w-5 h-5 text-good-600" />
          今日の善行を記録
        </CardTitle>
        <p className="text-center text-accessible-text-secondary">
          どんな小さなことでも大丈夫です
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メイン入力欄 */}
          <div>
            <div className="relative">
              <textarea
                id="title"
                placeholder="今日はどんな善行をしましたか？&#10;例: 電車で席を譲った、ゴミを拾った、家族に感謝を伝えた..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-4 rounded-lg border-2 border-zen-300 bg-white text-accessible-text-primary focus:border-good-500 focus:ring-0 placeholder:text-accessible-text-muted resize-none"
                rows={4}
                required
                aria-describedby="title-help"
              />
              {title.length > 0 && (
                <div className="absolute bottom-3 right-3 text-xs text-accessible-text-muted">
                  {title.length}/200
                </div>
              )}
            </div>
            
            {/* 提案ボタン - 一旦非表示 */}
            {/* {(template || recommendations.length > 0) && !showSuggestion && title.length === 0 && (
              <button
                type="button"
                onClick={() => setShowSuggestion(!showSuggestion)}
                className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 focus-visible-zen"
              >
                <Lightbulb className="w-4 h-4" />
                今日のおすすめを見る ({recommendations.length > 0 ? recommendations.length : 1}個)
              </button>
            )} */}
            
            {/* 提案表示 - 一旦非表示 */}
            {/* {showSuggestion && (
              <div className="mt-3 bg-gradient-good rounded-lg p-4 border border-good-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-good-700 font-medium">💡 今日のおすすめ</p>
                  {recommendations.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={goToPrevRecommendation}
                        className="p-1 text-good-600 hover:text-good-700 hover:bg-good-100 rounded-full transition-colors"
                        aria-label="前のおすすめ"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-good-600 font-medium">
                        {currentRecommendationIndex + 1} / {recommendations.length}
                      </span>
                      <button
                        type="button"
                        onClick={goToNextRecommendation}
                        className="p-1 text-good-600 hover:text-good-700 hover:bg-good-100 rounded-full transition-colors"
                        aria-label="次のおすすめ"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {(() => {
                  const currentTemplate = getCurrentRecommendation()
                  if (!currentTemplate) return null
                  
                  return (
                    <div>
                      <p className="text-good-800 font-medium mb-2">{currentTemplate.title}</p>
                      {currentTemplate.description && (
                        <p className="text-sm text-good-700 mb-3">{currentTemplate.description}</p>
                      )}
                      {'category' in currentTemplate && (currentTemplate as any).category && (
                        <p className="text-xs text-good-600 mb-3">
                          カテゴリ: {(currentTemplate as any).category}
                        </p>
                      )}
                    </div>
                  )
                })()}
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick()}
                    className="btn-zen-secondary text-xs px-3 py-1"
                  >
                    これにする
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuggestion(false)}
                    className="text-xs text-good-600 hover:text-good-700 px-3 py-1"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            )} */}
          </div>

          {/* 気分選択 */}
          <div>
            <label className="label-zen">実行後の気分</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.value}
                  type="button"
                  onClick={() => setMood(moodOption.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 focus-visible-zen motion-safe-zen min-h-[48px] ${
                    mood === moodOption.value
                      ? 'border-good-500 bg-good-100 text-good-700 shadow-lg ring-2 ring-good-200'
                      : `${moodOption.color} hover:shadow-md hover:scale-105`
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

          {/* 詳細メモ（任意） */}
          <div>
            <label htmlFor="note" className="label-zen">詳細メモ（任意）</label>
            <textarea
              id="note"
              placeholder="どんな状況だったか、どう感じたかなど..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="textarea-zen mt-2"
              rows={2}
              aria-describedby="note-description"
            />
            <p id="note-description" className="sr-only">善行の詳細や感想を記録したいことを入力してください。空欄でも構いません。</p>
          </div>

          {/* 送信ボタン */}
          <Button 
            type="submit" 
            variant="default"
            size="lg"
            disabled={isLoading || !title.trim()}
            className="w-full motion-safe-zen focus-visible-zen"
            aria-label={isLoading ? '善行を記録中' : '善行を記録する'}
          >
            {isLoading ? '記録中...' : '✨ 善行を記録する'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}