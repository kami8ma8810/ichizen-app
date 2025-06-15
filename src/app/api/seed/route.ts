import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const goodDeedTemplates = [
  {
    title: "誰かに感謝の気持ちを伝える",
    description: "家族、友人、同僚など身近な人に「ありがとう」を伝えましょう",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "感謝,コミュニケーション"
  },
  {
    title: "ゴミを1つ拾う",
    description: "道端や公園で落ちているゴミを拾って、環境を少しでもきれいにしましょう",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "環境,清掃"
  },
  {
    title: "電車で席を譲る",
    description: "必要としている人に電車やバスの席を譲りましょう",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "親切,公共交通"
  },
  {
    title: "家族の手伝いをする",
    description: "料理、掃除、買い物など家族の手伝いを進んで行いましょう",
    category: "FAMILY",
    difficulty: "MEDIUM",
    tags: "家族,手伝い"
  },
  {
    title: "同僚の仕事をサポートする",
    description: "忙しそうな同僚の仕事を手伝ったり、アドバイスをしたりしましょう",
    category: "WORK",
    difficulty: "MEDIUM",
    tags: "職場,協力"
  },
  {
    title: "知らない人に道案内をする",
    description: "迷っている人を見かけたら、親切に道案内をしてあげましょう",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "親切,地域"
  },
  {
    title: "新しいスキルを学ぶ",
    description: "本を読んだり、オンライン講座を受けたりして自己成長に時間を使いましょう",
    category: "PERSONAL",
    difficulty: "HARD",
    tags: "学習,成長"
  },
  {
    title: "健康的な食事を作る",
    description: "野菜をたくさん使った栄養バランスの良い食事を作りましょう",
    category: "HEALTH",
    difficulty: "MEDIUM",
    tags: "健康,料理"
  },
  {
    title: "チャリティに寄付する",
    description: "少額でも慈善団体や被災地支援などに寄付をしましょう",
    category: "CHARITY",
    difficulty: "EASY",
    tags: "寄付,支援"
  },
  {
    title: "近所の人に挨拶する",
    description: "近所の人に明るく挨拶をして、コミュニティの絆を深めましょう",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "挨拶,近所"
  },
  {
    title: "エコバッグを使う",
    description: "買い物の際はレジ袋を使わず、エコバッグを持参しましょう",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "環境,エコ"
  },
  {
    title: "後輩や部下にアドバイスする",
    description: "経験を活かして後輩や部下の成長をサポートしましょう",
    category: "WORK",
    difficulty: "MEDIUM",
    tags: "指導,職場"
  },
  {
    title: "運動を30分する",
    description: "ウォーキング、ストレッチ、筋トレなど体を動かしましょう",
    category: "HEALTH",
    difficulty: "MEDIUM",
    tags: "運動,健康"
  },
  {
    title: "友人に連絡を取る",
    description: "しばらく連絡を取っていない友人にメッセージを送りましょう",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "友情,連絡"
  },
  {
    title: "本を読んで知識を深める",
    description: "興味のある分野の本を読んで新しい知識を身につけましょう",
    category: "EDUCATION",
    difficulty: "HARD",
    tags: "読書,学習"
  }
]

export async function POST() {
  try {
    // 既存のテンプレートをクリア
    await prisma.goodDeedTemplate.deleteMany()

    // 新しいテンプレートを作成
    const templates = await prisma.goodDeedTemplate.createMany({
      data: goodDeedTemplates.map(template => ({
        ...template,
        category: template.category as any,
        difficulty: template.difficulty as any
      }))
    })

    return NextResponse.json({ 
      message: 'データベースが正常にシードされました',
      count: templates.count 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'シードに失敗しました' },
      { status: 500 }
    )
  }
}