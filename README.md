# 🌱 Ichizen App - 一日一善

「小さな善行を、習慣にする。」

## 📱 アプリ概要

20〜50代のユーザーを対象に、毎日1つの「ちょっと良いこと」を実行・記録して、ポジティブな習慣を育てるシンプルな習慣化アプリです。

**大規模ユーザー対応可能な設計** で構築されており、数万〜数十万ユーザーの利用にも耐えうるインフラとアーキテクチャを採用しています。

### 主な機能

- ✅ **善行の提案と記録**: 毎日ランダムで善行テンプレートから1件を提示
- 📅 **カレンダー表示**: 善行を記録した日を可視化（ハビットトラッカー風UI）
- 🔔 **通知システム**: リマインダー通知とプッシュ通知
- 🏅 **実績バッジ**: 実行数に応じてバッジを取得
- 💬 **日記機能**: 善行にコメントをつけてメモ
- 🔐 **認証システム**: Google/Apple/匿名ログイン対応

## 🏗️ スケーラブル技術構成

### フロントエンド
- **Next.js 15** (App Router + React 19)
- **TypeScript 5.7** (厳密な型チェック)
- **Tailwind CSS 3.4** (デザインシステム)
- **Zustand** (状態管理)
- **React Query** (サーバー状態管理)

### バックエンド・インフラ
- **Vercel** (ホスティング + Edge Functions)
- **Firebase** (認証 + リアルタイム通知)
- **PostgreSQL** (Google Cloud SQL)
- **Prisma** (ORM + 型安全なDB操作)
- **Redis** (キャッシュ + セッション管理)

### 監視・分析
- **Vercel Analytics** (パフォーマンス監視)
- **Sentry** (エラー追跡)
- **Google Analytics 4** (ユーザー行動分析)

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
# Node.js 18以上が必要
node --version

# pnpmを使用（推奨）
npm install -g pnpm
pnpm install
```

### 2. 環境変数の設定

```bash
# env.exampleをコピー
cp env.example .env.local

# 必要な環境変数を設定
# - Firebase設定
# - PostgreSQL接続情報
# - Redis設定
```

### 3. データベースセットアップ

```bash
# Prismaスキーマを適用
pnpm db:push

# Prisma Clientを生成
pnpm db:generate
```

### 4. 開発サーバー起動

```bash
pnpm dev
```

## 📁 プロジェクト構造

```
src/
├── app/                 # Next.js App Router
├── components/          # 再利用可能コンポーネント
│   ├── ui/             # ベースUIコンポーネント
│   └── features/       # 機能別コンポーネント
├── lib/                 # ユーティリティ・設定
├── hooks/               # カスタムフック
├── types/               # 型定義
├── utils/               # ヘルパー関数
└── config/              # 設定ファイル
```

## 🧪 テスト・品質管理

```bash
# 型チェック
pnpm type-check

# ESLint
pnpm lint

# ユニットテスト
pnpm test

# E2Eテスト
pnpm test:e2e
```

## 📊 スケーラビリティ対応

### パフォーマンス最適化
- **Partial Prerendering (PPR)** でページロード高速化
- **React Server Components** でバンドルサイズ削減
- **Image Optimization** で画像配信最適化
- **CDN配信** でグローバル高速化

### データベース最適化
- **Connection Pooling** で接続効率化
- **Read Replica** で読み取り分散
- **Redis Caching** で頻繁なクエリ最適化
- **Database Indexing** でクエリ高速化

### 監視・運用
- **Real-time Error Tracking** でバグ即座対応
- **Performance Monitoring** で体験品質維持
- **Auto-scaling** で負荷変動対応

## 🔧 開発コマンド

```bash
# 開発
pnpm dev

# ビルド
pnpm build

# 本番起動
pnpm start

# 型チェック
pnpm type-check

# データベース操作
pnpm db:generate    # Prisma Client生成
pnpm db:push        # スキーマ適用
pnpm db:studio      # DB GUI起動
```

## 🤝 コントリビューション

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 📧 お問い合わせ

プロジェクトについての質問や提案は Issue または Pull Request にてお願いします。
