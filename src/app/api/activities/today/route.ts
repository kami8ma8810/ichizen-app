import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayActivity = await prisma.activity.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      include: {
        template: {
          select: {
            title: true,
            description: true,
            category: true,
            difficulty: true
          }
        }
      }
    })

    return NextResponse.json(todayActivity)
  } catch (error) {
    console.error('Today activity fetch error:', error)
    return NextResponse.json(
      { error: '今日の活動取得に失敗しました' },
      { status: 500 }
    )
  }
}