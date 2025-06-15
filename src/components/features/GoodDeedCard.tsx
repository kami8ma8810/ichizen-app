'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
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
  onComplete?: (templateId: string) => void
  isCompleted?: boolean
  isLoading?: boolean
}

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800', 
  HARD: 'bg-red-100 text-red-800'
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{template.title}</CardTitle>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[template.difficulty]}`}>
              {difficultyLabels[template.difficulty]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="w-4 h-4" />
          <span className="text-sm text-gray-600">
            {categoryLabels[template.category as keyof typeof categoryLabels] || template.category}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        {template.description && (
          <CardDescription className="mb-4">
            {template.description}
          </CardDescription>
        )}
        
        {template.tags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {template.tags.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button 
          variant={isCompleted ? "secondary" : "good"}
          className="w-full"
          onClick={() => onComplete?.(template.id)}
          disabled={isCompleted || isLoading}
        >
          {isLoading ? '記録中...' : isCompleted ? '完了済み' : '今日の善行を記録する'}
        </Button>
      </CardContent>
    </Card>
  )
}