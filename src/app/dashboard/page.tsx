'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useGoodDeeds } from '@/hooks/useGoodDeeds'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Trophy, TrendingUp, LogOut, Plus, Check } from 'lucide-react'
import { StreakDisplay } from '@/components/features/StreakDisplay'

const DashboardPage = () => {
  const router = useRouter()
  const { logout, isLoading } = useAuth()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [mood, setMood] = useState('GOOD')
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { todayActivity, isLoading: goodDeedsLoading, error, recordActivity } = useGoodDeeds(user?.uid || null)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/')
      } else {
        setIsPageLoading(false)
      }
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push('/')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await recordActivity(null, note, mood, title)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      setTitle('')
      setNote('')
      setMood('GOOD')
    } catch (error) {
      console.error('Record error:', error)
    }
  }

  const moods = [
    { value: 'EXCELLENT', label: '最高', emoji: '🤩' },
    { value: 'GOOD', label: '良い', emoji: '😊' },
    { value: 'NEUTRAL', label: '普通', emoji: '😐' },
    { value: 'BAD', label: '微妙', emoji: '😔' },
  ]

  if (isPageLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              一日一善
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.name || user.email || 'ゲスト'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            おかえりなさい、{user.name || 'ゲスト'}さん
          </h2>
          <p className="mt-2 text-muted-foreground">
            今日も小さな善行から始めましょう
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 shadow-md">
              <Check className="h-5 w-5" />
              <span className="font-medium">善行を記録しました！</span>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Record Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  今日の善行を記録
                </CardTitle>
              </CardHeader>
                <CardContent>
                {todayActivity ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      今日の善行完了！
                    </h3>
                    <p className="mb-2 text-muted-foreground">
                      {todayActivity.customTitle || todayActivity.template?.title}
                    </p>
                    {todayActivity.note && (
                      <p className="italic text-muted-foreground">
                        "{todayActivity.note}"
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        今日の善行
                      </label>
                      <Textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="例: 電車で席を譲った、ゴミを拾った..."
                        className="min-h-[100px] resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        メモ（任意）
                      </label>
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="どんな気持ちだったか記録しましょう"
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        今の気分
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {moods.map((m) => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => setMood(m.value)}
                            className={`rounded-lg border-2 p-3 transition-all ${
                              mood === m.value
                                ? 'border-primary bg-primary/5'
                                : 'border-input hover:border-primary/50'
                            }`}
                          >
                            <div className="mb-1 text-2xl">{m.emoji}</div>
                            <div className="text-sm">{m.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={goodDeedsLoading || !title.trim()}
                    >
                      記録する
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Streak Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  ストリーク
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StreakDisplay userId={user.uid} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  クイックアクション
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => router.push('/calendar')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  カレンダーを見る
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage