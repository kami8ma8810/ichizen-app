import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 全てのアクティブなテンプレートを取得
    const allTemplates = await prisma.goodDeedTemplate.findMany({
      where: { isActive: true },
      orderBy: { usageCount: 'asc' }
    })

    // シャッフルして5個選択
    const shuffled = [...allTemplates].sort(() => 0.5 - Math.random())
    const recommendations = shuffled.slice(0, 5)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Recommendations fetch error:', error)
    return NextResponse.json(
      { error: 'おすすめテンプレートの取得に失敗しました' },
      { status: 500 }
    )
  }
}