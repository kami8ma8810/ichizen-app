import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const firebaseUid = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      )
    }

    // Firebase UIDからデータベースUser IDを取得
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    const where: Record<string, unknown> = { userId: user.id }

    if (startDate && endDate) {
      where['date'] = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        template: {
          select: {
            title: true,
            category: true,
            difficulty: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Activities fetch error:', error)
    return NextResponse.json(
      { error: '活動履歴の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const { userId: firebaseUid, templateId, date, note, mood, customTitle } = data

    if (!firebaseUid || !date || (!templateId && !customTitle)) {
      return NextResponse.json(
        { error: '必須項目が不足しています（ユーザーID、日付、テンプレートIDまたはカスタムタイトルが必要）' },
        { status: 400 }
      )
    }

    // Firebase UIDから数据库User IDを取得
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません。再ログインしてください。' },
        { status: 404 }
      )
    }

    // 同じ日の活動が既に存在するかチェック
    const existingActivity = await prisma.activity.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: new Date(date)
        }
      }
    })

    if (existingActivity) {
      return NextResponse.json(
        { error: '今日の善行は既に記録されています' },
        { status: 409 }
      )
    }

    const activity = await prisma.activity.create({
      data: {
        userId: user.id, // データベースのUser IDを使用
        templateId: templateId || null,
        date: new Date(date),
        note,
        mood: mood || 'GOOD',
        status: 'COMPLETED',
        customTitle: customTitle || null
      },
      include: {
        template: templateId ? {
          select: {
            title: true,
            category: true,
            difficulty: true
          }
        } : false
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json(
      { error: '活動の記録に失敗しました' },
      { status: 500 }
    )
  }
}