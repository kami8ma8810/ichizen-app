import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.goodDeedTemplate.findMany({
      where: { isActive: true },
      orderBy: { usageCount: 'asc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Templates fetch error:', error)
    return NextResponse.json(
      { error: 'テンプレートの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const template = await prisma.goodDeedTemplate.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Template creation error:', error)
    return NextResponse.json(
      { error: 'テンプレートの作成に失敗しました' },
      { status: 500 }
    )
  }
}