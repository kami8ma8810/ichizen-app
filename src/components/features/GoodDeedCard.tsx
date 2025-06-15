'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button-zen"
import { Badge } from "lucide-react"

interface GoodDeedTemplate {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string | null
}

interface GoodDeedCardProps {
  template: GoodDeedTemplate
  onComplete?: () => void
  isCompleted?: boolean
  isLoading?: boolean
}

const difficultyColors = {
  EASY: 'bg-good-50 text-good-700 border border-good-200',
  MEDIUM: 'bg-vermillion-50 text-vermillion-700 border border-vermillion-200', 
  HARD: 'bg-red-50 text-red-700 border border-red-200'
}

const difficultyLabels = {
  EASY: '簡単',
  MEDIUM: '普通',
  HARD: '難しい'
}

const categoryLabels = {
  KINDNESS: '親切',
  ENVIRONMENT: '環境',
  COMMUNITY: 'コミュニティ',
  FAMILY: '家族',
  HEALTH: '健康',
  WORK: '仕事',
  PERSONAL: '個人的成長',
  CHARITY: 'チャリティ',
  EDUCATION: '教育',
  OTHER: 'その他'
}

export function GoodDeedCard({ template, onComplete, isCompleted = false, isLoading = false }: GoodDeedCardProps) {
  return (
    <Card className="card-zen w-full max-w-md mx-auto hover:shadow-zen-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="title-zen text-lg">{template.title}</CardTitle>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[template.difficulty]}`}>
              {difficultyLabels[template.difficulty]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="w-4 h-4 text-zen-500" />
          <span className="text-sm text-accessible-text-secondary font-medium">
            {categoryLabels[template.category as keyof typeof categoryLabels] || template.category}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {template.description && (
          <CardDescription className="mb-4 text-accessible-text-muted leading-relaxed">
            {template.description}
          </CardDescription>
        )}
        
        {template.tags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {template.tags.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-zen-100 text-zen-700 text-xs rounded border border-zen-200 transition-colors hover:bg-zen-200"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button 
          variant={isCompleted ? "secondary" : "default"}
          size="lg"
          className="w-full motion-safe-zen focus-visible-zen"
          onClick={() => onComplete?.()}
          disabled={isCompleted || isLoading}
          aria-label={isLoading ? '善行を記録中' : isCompleted ? '完了済みの善行' : '今日の善行を記録する'}
        >
          {isLoading ? '記録中...' : isCompleted ? '✓ 完了済み' : '今日の善行を記録する'}
        </Button>
      </CardContent>
    </Card>
  )
}