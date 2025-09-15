import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // リクエストからFirebase UIDを取得（オプション）
    const body = await request.json().catch(() => ({}))
    const firebaseUid = body.firebaseUid || 'test-user-123'
    
    // テスト用のユーザーを取得または作成
    let testUser = await prisma.user.findFirst({
      where: { firebaseUid: firebaseUid }
    })
    
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          firebaseUid: firebaseUid,
          email: 'test@example.com',
          name: 'テストユーザー'
        }
      })
    }

    // 過去30日分のテストデータを作成
    const today = new Date()
    const activities = []
    
    // テンプレートのサンプル（customTitleのみ使用）
    const templates = [
      '電車で席を譲った',
      'ゴミを拾った',
      '募金をした',
      '道案内をした',
      'ドアを開けて待った',
      '落とし物を届けた',
      '買い物を手伝った',
      '挨拶をした',
      'お礼を伝えた',
      '花に水をあげた'
    ]

    const moods = ['EXCELLENT', 'GOOD', 'NEUTRAL', 'BAD']
    const notes = [
      '気持ちよかった！',
      '少し恥ずかしかったけど、やってよかった',
      '自然にできるようになってきた',
      '相手の笑顔が嬉しかった',
      '小さなことでも意味があると感じた',
      '習慣になってきた気がする',
      '今日も一日頑張った',
      ''
    ]

    // 過去30日分のデータを作成（ランダムに抜けがある）
    for (let i = 0; i < 30; i++) {
      // 70%の確率でその日のアクティビティを作成
      if (Math.random() > 0.3) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        date.setHours(12, 0, 0, 0) // 正午に設定
        
        const customTitle = templates[Math.floor(Math.random() * templates.length)]
        const mood = moods[Math.floor(Math.random() * moods.length)]
        const note = notes[Math.floor(Math.random() * notes.length)]
        
        activities.push({
          userId: testUser.id,
          customTitle: customTitle,
          note: note,
          mood: mood,
          date: date // DateTimeとして保存
        })
      }
    }

    // 既存のアクティビティをクリア
    await prisma.activity.deleteMany({
      where: { userId: testUser.id }
    })

    // 新しいアクティビティを作成
    for (const activity of activities) {
      await prisma.activity.create({
        data: activity
      })
    }

    return NextResponse.json({
      success: true,
      message: `${activities.length}件のテストデータを作成しました`,
      userId: testUser.id,
      firebaseUid: testUser.firebaseUid
    })

  } catch (error) {
    console.error('Seed calendar error:', error)
    return NextResponse.json(
      { error: 'テストデータの作成に失敗しました' },
      { status: 500 }
    )
  }
}