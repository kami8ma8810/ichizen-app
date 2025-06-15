import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, name, image } = await request.json()

    if (!firebaseUid) {
      return NextResponse.json(
        { error: 'Firebase UIDが必要です' },
        { status: 400 }
      )
    }

    // 既存のユーザーを確認
    let user = await prisma.user.findUnique({
      where: { firebaseUid }
    })

    if (!user) {
      // ユーザーが存在しない場合は新規作成
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email: email || null,
          name: name || null,
          image: image || null,
        }
      })
      console.log(`✅ 新しいユーザーを作成しました: ${user.id} (Firebase UID: ${firebaseUid})`)
    } else {
      // 既存ユーザーの情報を更新
      user = await prisma.user.update({
        where: { firebaseUid },
        data: {
          email: email || user.email,
          name: name || user.name,
          image: image || user.image,
          updatedAt: new Date()
        }
      })
      console.log(`🔄 ユーザー情報を更新しました: ${user.id}`)
    }

    return NextResponse.json({ 
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      image: user.image
    })
  } catch (error) {
    console.error('User sync error:', error)
    return NextResponse.json(
      { error: 'ユーザー同期に失敗しました' },
      { status: 500 }
    )
  }
}