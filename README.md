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

# 🌟 一日一善アプリ

毎日小さな善行を積み重ねて、より良い自分と社会を築くためのアプリケーションです。

## 🏗️ アーキテクチャ

- **フロントエンド**: Next.js 15 + React 19 + TypeScript
- **認証**: Firebase Auth（Google/Apple/匿名ログイン対応）
- **状態管理**: Zustand + React Query
- **データベース**: Firestore + PostgreSQL + Redis
- **インフラ**: Vercel + マルチリージョン対応
- **UIライブラリ**: Tailwind CSS + Radix UI

## 🚀 セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/ichizen-app.git
cd ichizen-app
```

### 2. 依存関係のインストール
```bash
pnpm install
```

### 3. Firebase プロジェクトの作成・設定

#### 3.1 Firebase Console でプロジェクト作成
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `ichizen-app` （お好みで変更可能）
4. Analytics を有効化（推奨）

#### 3.2 Authentication の設定
1. Firebase Console で「Authentication」を選択
2. 「Sign-in method」タブで以下を有効化：
   - **メール/パスワード** ✅
   - **Google** ✅（Google OAuth 2.0 設定）
   - **匿名** ✅

#### 3.3 Firestore Database の設定
1. Firebase Console で「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. 「テストモードで開始」を選択（開発環境）
4. ロケーション: `asia-northeast1` (東京) を選択

#### 3.4 Firebase設定の取得
1. Firebase Console でプロジェクト設定（⚙️マーク）に移動
2. 「全般」タブで「アプリを追加」 → 「ウェブ」を選択
3. アプリ名: `ichizen-web-app`
4. 設定情報をコピー

### 4. 環境変数の設定

`.env.local` ファイルを作成し、Firebase設定を追加：

```bash
# Firebase認証設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# 開発環境設定
NODE_ENV=development
```

### 5. アプリケーションの起動

#### 💻 PC開発用
```bash
pnpm dev
```

#### 📱 スマホテスト用（QRコード付き）
```bash
pnpm run dev:mobile
```

PC: http://localhost:3000 でアプリケーションが起動します。

📱 **スマホテスト方法:**
1. `pnpm run dev:mobile` でモバイル対応サーバー起動
2. ブラウザで http://localhost:3000 にアクセス
3. 「📱 スマホテスト（QRコード）」ボタンをクリック
4. 表示されるQRコードをスマホでスキャン
5. スマホで実機テスト完了！

## 🔐 認証機能の使い方（フロントエンド開発者向け）

### 基本的な認証フック
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { 
    loginWithEmail, 
    loginWithGoogle, 
    loginAnonymously,
    isLoading, 
    error 
  } = useAuth();

  const handleEmailLogin = async (email: string, password: string) => {
    const success = await loginWithEmail({ email, password, rememberMe: true });
    if (success) {
      // ログイン成功時の処理
    }
  };

  return (
    <div>
      {isLoading && <p>ログイン中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* ログインフォーム */}
    </div>
  );
}
```

### 認証が必要なページ
```typescript
import { useRequireAuth } from '@/hooks/useAuth';

function DashboardPage() {
  const { shouldShowContent, isLoading } = useRequireAuth();

  if (isLoading) return <div>読み込み中...</div>;
  if (!shouldShowContent) return null; // リダイレクト中

  return (
    <div>
      {/* 認証済みユーザーのみ表示 */}
    </div>
  );
}
```

### ユーザー情報の取得
```typescript
import { useUser } from '@/stores/authStore';

function UserProfile() {
  const user = useUser();

  return (
    <div>
      <h1>こんにちは、{user?.name || user?.email}さん！</h1>
      <p>最後のログイン: {user?.lastLoginAt.toLocaleDateString()}</p>
    </div>
  );
}
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── (protected)/       # 認証必須ページ
│   └── layout.tsx         # ルートレイアウト
├── components/            # Reactコンポーネント
│   ├── auth/              # 認証関連コンポーネント
│   └── ui/                # 基本UIコンポーネント
├── hooks/                 # カスタムフック
│   └── useAuth.ts         # 認証フック
├── stores/                # 状態管理（Zustand）
│   └── authStore.ts       # 認証状態
├── lib/                   # ユーティリティ
│   ├── firebase.ts        # Firebase設定
│   └── auth.ts            # 認証サービス
├── types/                 # TypeScript型定義
│   └── auth.ts            # 認証関連型
└── config/                # 設定ファイル
    └── firebase.ts        # Firebase設定
```

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# リンター実行
pnpm lint

# 型チェック
pnpm type-check

# テスト実行（将来実装）
pnpm test
```

## 📝 実装状況

### ✅ Phase 1: 基盤構築（完了）
- [x] Next.js 15 + React 19 セットアップ
- [x] TypeScript設定
- [x] Tailwind CSS設定
- [x] マルチデータベース設計
- [x] インフラ設計

### ✅ Phase 2: 認証・セキュリティ（完了）
- [x] Firebase Auth設定
- [x] 認証状態管理（Zustand）
- [x] 認証フック実装
- [x] 認証UI作成
- [x] セキュリティ強化
- [x] TypeScript型安全性保証

### ✅ Phase 3: コア機能（完了）
- [x] 善行テンプレート機能（15 種類のサンプル）
- [x] 活動記録機能（気分・メモ付き）
- [x] カレンダー表示（ハビットトラッカー）
- [x] ストリーク機能（連続記録・最長記録）
- [x] データベース統合（SQLite + Prisma）
- [x] API実装（CRUD操作）

### 🔄 Phase 4: 高度な機能（部分実装）
- [x] ストリーク機能
- [x] 統計・分析（基本）
- [ ] バッジシステム
- [ ] 通知システム
- [ ] コミュニティ機能

## 🎉 MVP完成！

一日一善アプリの基本機能がすべて実装され、動作確認済みです。スマホでも快適に利用できるレスポンシブデザインを採用しています。

## 🔧 トラブルシューティング

### Firebase接続エラー
```bash
# Firebase設定が正しいか確認
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
```

### 認証状態が保持されない
- ブラウザのローカルストレージを確認
- Firebase設定の `authDomain` が正しいか確認

## 📚 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query Documentation](https://tanstack.com/query)

---

**🌟 より良い世界を一日一善で築いていきましょう！**
