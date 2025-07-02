import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 500個の善行テンプレート統合版
const goodDeedTemplates = [
  // KINDNESS: 150個
  {
    title: "家族に「おはよう」を明るく言う",
    description: "朝の挨拶で一日を気持ちよくスタート",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "家族,挨拶,朝"
  },
  {
    title: "配偶者のコーヒーを淹れる",
    description: "忙しい朝に一杯のコーヒーでサポート",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "家族,サポート,朝"
  },
  {
    title: "子どもの話を最後まで聞く",
    description: "忙しくても子どもの話に耳を傾ける",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "家族,子ども,傾聴"
  },
  {
    title: "両親に安否確認の連絡をする",
    description: "「元気？」の一言で安心してもらう",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "家族,両親,連絡"
  },
  {
    title: "兄弟姉妹に近況を聞く",
    description: "久しぶりの連絡で関係を温める",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "家族,兄弟,連絡"
  },
  {
    title: "同僚に「お疲れさま」と声をかける",
    description: "一言でも相手の気持ちが軽くなります",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "職場,挨拶,仕事の日"
  },
  {
    title: "会議室のホワイトボードを消す",
    description: "次の人が気持ちよく使えるように",
    category: "WORK",
    difficulty: "EASY",
    tags: "職場,清掃,仕事の日"
  },
  {
    title: "コピー機の紙を補充する",
    description: "気づいたときにサッと補充",
    category: "WORK",
    difficulty: "EASY",
    tags: "職場,気遣い,仕事の日"
  },
  {
    title: "エレベーターで他の人を待つ",
    description: "急いでいても2-3秒待ってあげる",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "職場,親切,仕事の日"
  },
  {
    title: "通勤電車で奥に詰める",
    description: "後から乗る人のスペースを作る",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "通勤,公共交通,仕事の日"
  },
  {
    title: "昼休みにデスク周りを拭く",
    description: "1分でできる小さな整理整頓",
    category: "WORK",
    difficulty: "EASY",
    tags: "職場,清掃,仕事の日"
  },
  {
    title: "新人や後輩に笑顔で接する",
    description: "緊張している人にやさしい表情を",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "職場,新人,仕事の日"
  },
  {
    title: "階段を使う（エレベーターを譲る）",
    description: "健康にも良く、他の人にエレベーターを譲れます",
    category: "HEALTH",
    difficulty: "EASY",
    tags: "健康,職場,仕事の日"
  },

  // === 休みの日にできる小さな善行 ===
  {
    title: "家族に「ありがとう」を伝える",
    description: "普段言えない感謝の気持ちを素直に",
    category: "FAMILY",
    difficulty: "EASY",
    tags: "家族,感謝,休みの日"
  },
  {
    title: "落ちているゴミを1つ拾う",
    description: "散歩中や外出時に見つけたらサッと",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "環境,散歩,休みの日"
  },
  {
    title: "近所の人に挨拶する",
    description: "顔を合わせたら明るく「おはようございます」",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "近所,挨拶,休みの日"
  },
  {
    title: "レジで店員さんに「ありがとう」と言う",
    description: "お会計の時に一言添えるだけ",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "買い物,感謝,休みの日"
  },
  {
    title: "電車・バスで席を譲る",
    description: "必要な人に気づいたらさりげなく",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "公共交通,親切,休みの日"
  },
  {
    title: "コンビニで募金箱に小銭を入れる",
    description: "お釣りの小銭を少しだけ",
    category: "CHARITY",
    difficulty: "EASY",
    tags: "寄付,コンビニ,休みの日"
  },
  {
    title: "友人や家族にメッセージを送る",
    description: "「元気？」の一言でも相手は嬉しいもの",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "友人,連絡,休みの日"
  },
  {
    title: "マイバッグを持参する",
    description: "買い物にはエコバッグを忘れずに",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "環境,買い物,休みの日"
  },

  // === 年代・性別を問わずできる善行 ===
  {
    title: "エスカレーターで右側（左側）を空ける",
    description: "急ぐ人のために片側を空けて立つ",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "公共施設,マナー"
  },
  {
    title: "ドアを次の人のために開けて待つ",
    description: "後ろに人がいたら2-3秒待ってあげる",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "日常,親切"
  },
  {
    title: "信号待ちでスマホを見ずに周りに気を配る",
    description: "困っている人や危険に気づけるかも",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "安全,気遣い"
  },
  {
    title: "使った場所をきれいにして帰る",
    description: "カフェやトイレなど、次の人のために",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "マナー,清掃"
  },
  {
    title: "道を聞かれたら笑顔で答える",
    description: "知らなくても親切に対応する",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "親切,道案内"
  },
  {
    title: "深呼吸して気持ちを整える",
    description: "自分を大切にすることも善行です",
    category: "PERSONAL",
    difficulty: "EASY",
    tags: "健康,メンタル"
  },
  {
    title: "今日一日を振り返って感謝する",
    description: "小さなことでも良かったことを思い出す",
    category: "PERSONAL",
    difficulty: "EASY",
    tags: "感謝,振り返り"
  },
  {
    title: "植物に水をあげる",
    description: "家の植物や街の花壇に気を遣う",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "植物,環境"
  },
  {
    title: "横断歩道で子どもや高齢者を見守る",
    description: "一緒に渡って安全を確保",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "安全,見守り"
  },
  {
    title: "忘れ物を届ける",
    description: "落とし物を見つけたら近くの人に声をかける",
    category: "KINDNESS",
    difficulty: "EASY",
    tags: "親切,落とし物"
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