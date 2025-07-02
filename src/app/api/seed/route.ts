import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 500個の善行テンプレート（各カテゴリから主要なもの抜粋版）
const goodDeedTemplates = [
  // KINDNESS: 家族・身近な人への親切（30個の代表例）
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

  // WORK: 職場での善行（20個の代表例）
  {
    title: "同僚に「お疲れさま」と声をかける",
    description: "一言でも相手の気持ちが軽くなります",
    category: "WORK",
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
    category: "WORK",
    difficulty: "EASY",
    tags: "職場,親切,仕事の日"
  },
  {
    title: "プリンターの紙を補充する",
    description: "用紙切れに気づいたら新しい紙をセットする",
    category: "WORK",
    difficulty: "EASY",
    tags: "プリンター,紙,補充"
  },

  // FAMILY: 家族の絆を深める（15個の代表例）
  {
    title: "朝のコーヒーを作って渡す",
    description: "パートナーが起きる前に温かいコーヒーを準備する",
    category: "FAMILY",
    difficulty: "EASY",
    tags: "コーヒー,朝,思いやり"
  },
  {
    title: "帰宅時に「お疲れさま」と声をかける",
    description: "玄関で温かい言葉で迎える",
    category: "FAMILY",
    difficulty: "EASY",
    tags: "挨拶,労い,帰宅"
  },
  {
    title: "子どもの話を膝の上で聞く",
    description: "子どもが話したがっている時に膝に座らせて聞く",
    category: "FAMILY",
    difficulty: "EASY",
    tags: "子ども,膝の上,傾聴"
  },
  {
    title: "週に一度は電話をかける",
    description: "「元気？」と安否確認の電話をする",
    category: "FAMILY",
    difficulty: "EASY",
    tags: "電話,安否確認,定期連絡"
  },
  {
    title: "家族全員で食事をする",
    description: "みんなでテーブルを囲んで食事を楽しむ",
    category: "FAMILY",
    difficulty: "EASY",
    tags: "食事,家族団らん,時間"
  },

  // COMMUNITY: 地域コミュニティ（15個の代表例）
  {
    title: "近所の人に明るく挨拶する",
    description: "顔を合わせたら笑顔で「おはようございます」",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "挨拶,近所,笑顔"
  },
  {
    title: "お隣さんの郵便物を預かる",
    description: "不在の際に配達員から郵便物を受け取って預かる",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "郵便,近所,助け合い"
  },
  {
    title: "公共交通機関で席を譲る",
    description: "妊婦さんや高齢者、体の不自由な方に席を譲る",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "席譲り,公共交通,思いやり"
  },
  {
    title: "地域の清掃活動に参加する",
    description: "月1回の地域清掃に参加してゴミ拾いをする",
    category: "COMMUNITY",
    difficulty: "MEDIUM",
    tags: "清掃活動,ゴミ拾い,参加"
  },
  {
    title: "近所の子どもたちに「おかえり」と声をかける",
    description: "学校から帰ってくる子どもたちに温かく声をかける",
    category: "COMMUNITY",
    difficulty: "EASY",
    tags: "子ども,声かけ,見守り"
  },

  // ENVIRONMENT: 環境保護（12個の代表例）
  {
    title: "マイバッグを持参して買い物する",
    description: "レジ袋を使わずエコバッグで買い物する",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "マイバッグ,買い物,レジ袋削減"
  },
  {
    title: "使わない部屋の電気を消す",
    description: "誰もいない部屋の照明をこまめに消して節電する",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "節電,省エネ,電気代節約"
  },
  {
    title: "マイボトルで水分補給する",
    description: "ペットボトルの代わりに水筒を持参する",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "マイボトル,水筒,ペットボトル削減"
  },
  {
    title: "ペットボトルのラベルを剥がす",
    description: "リサイクル効率を上げるためラベルとキャップを分別",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "ペットボトル,ラベル,リサイクル"
  },
  {
    title: "虫を殺さずに外に逃がす",
    description: "家に入った虫を殺さずに優しく外へ誘導",
    category: "ENVIRONMENT",
    difficulty: "EASY",
    tags: "虫,生き物,共生"
  },

  // HEALTH: 健康向上（10個の代表例）
  {
    title: "階段を使って移動する",
    description: "エレベーターの代わりに階段で軽い運動",
    category: "HEALTH",
    difficulty: "EASY",
    tags: "階段,運動,体力"
  },
  {
    title: "1分間のストレッチをする",
    description: "首や肩の簡単なストレッチで血行促進",
    category: "HEALTH",
    difficulty: "EASY",
    tags: "ストレッチ,血行,肩こり"
  },
  {
    title: "コップ一杯の水を飲む",
    description: "水分補給で体の巡りを良くする",
    category: "HEALTH",
    difficulty: "EASY",
    tags: "水分補給,デトックス,代謝"
  },
  {
    title: "5分間瞑想する",
    description: "目を閉じて呼吸に集中し心を落ち着ける",
    category: "HEALTH",
    difficulty: "EASY",
    tags: "瞑想,呼吸,集中"
  },
  {
    title: "寝る1時間前にスマホを見ない",
    description: "ブルーライトを避けて質の良い睡眠を準備",
    category: "HEALTH",
    difficulty: "MEDIUM",
    tags: "睡眠,スマホ,ブルーライト"
  },

  // PERSONAL: 個人的成長（8個の代表例）
  {
    title: "今日の失敗から学びを見つける",
    description: "うまくいかなかった事から改善点を考える",
    category: "PERSONAL",
    difficulty: "EASY",
    tags: "失敗,学び,改善"
  },
  {
    title: "今日良いことを3つ思い出す",
    description: "どんな小さなことでも嬉しかった出来事を見つける",
    category: "PERSONAL",
    difficulty: "EASY",
    tags: "感謝,ポジティブ,幸せ"
  },
  {
    title: "知らない単語を1つ調べる",
    description: "今日聞いた言葉で意味が曖昧なものを辞書で確認する",
    category: "PERSONAL",
    difficulty: "EASY",
    tags: "語彙,学習,知識"
  },
  {
    title: "姿勢を正す",
    description: "背筋を伸ばして正しい姿勢を30秒間保つ",
    category: "PERSONAL",
    difficulty: "EASY",
    tags: "姿勢,健康,習慣"
  },

  // CHARITY: チャリティ・支援（5個の代表例）
  {
    title: "コンビニの募金箱に小銭を入れる",
    description: "お釣りの小銭を災害支援や福祉団体に寄付",
    category: "CHARITY",
    difficulty: "EASY",
    tags: "募金,小銭,災害支援"
  },
  {
    title: "古着をリサイクルボックスに入れる",
    description: "着なくなった衣類を回収ボックスに寄付",
    category: "CHARITY",
    difficulty: "EASY",
    tags: "古着,リサイクル,衣類寄付"
  },
  {
    title: "献血に協力する",
    description: "献血ルームや献血車で血液を提供する",
    category: "CHARITY",
    difficulty: "MEDIUM",
    tags: "献血,医療支援,血液提供"
  },
  {
    title: "支援情報をSNSでシェア",
    description: "災害支援や慈善活動の情報を拡散する",
    category: "CHARITY",
    difficulty: "EASY",
    tags: "SNS,情報拡散,支援情報"
  },

  // EDUCATION: 教育・学習（3個の代表例）
  {
    title: "子どもの質問に丁寧に答える",
    description: "子どもの疑問に時間をかけて説明してあげる",
    category: "EDUCATION",
    difficulty: "EASY",
    tags: "子ども,質問,説明"
  },
  {
    title: "同僚の分からない操作を教える",
    description: "困っている同僚にパソコンやツールの使い方を説明する",
    category: "EDUCATION",
    difficulty: "EASY",
    tags: "同僚,操作説明,職場"
  },
  {
    title: "読んだ本の感想をSNSでシェアする",
    description: "読書後の気づきや学びを他の人にも共有する",
    category: "EDUCATION",
    difficulty: "EASY",
    tags: "読書,感想,SNS,共有"
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
      message: 'データベースが正常にシードされました（代表版）',
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