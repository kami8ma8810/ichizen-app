import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // 今日の日付をベースにシードを作成（一貫した結果を得るため）
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    
    const templates = await prisma.goodDeedTemplate.findMany({
      where: { isActive: true },
      orderBy: { usageCount: 'asc' }
    })

    if (templates.length === 0) {
      return NextResponse.json(
        { error: 'テンプレートが見つかりませんでした' },
        { status: 404 }
      )
    }

    // 今日の日付ベースで決定論的にテンプレートを選択
    const selectedTemplate = templates[dayOfYear % templates.length]

    // 使用回数を増加
    await prisma.goodDeedTemplate.update({
      where: { id: selectedTemplate!.id },
      data: { usageCount: { increment: 1 } }
    })

    return NextResponse.json(selectedTemplate)
  } catch (error) {
    console.error('Daily template fetch error:', error)
    return NextResponse.json(
      { error: '今日のテンプレート取得に失敗しました' },
      { status: 500 }
    )
  }
}