# 🛠 開発ガイド

## 🚀 クイックスタート

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# 📱 スマホテスト用
pnpm run dev:mobile
```

## 🔐 Firebase設定

### 環境変数設定
```bash
# .env.local ファイルをコピー
cp .env.local.example .env.local
```

### 開発環境での認証
- **Googleログイン**: 自動で設定済み（追加設定不要）
- **メールログイン**: すぐに利用可能
- **匿名ログイン**: すぐに利用可能

## 📱 スマホテスト方法

### 1. QRコード使用（推奨）
```bash
# モバイル対応サーバー起動
pnpm run dev:mobile

# ブラウザで http://localhost:3000 を開く
# 「📱 スマホテスト（QRコード）」をクリック
# QRコードをスマホでスキャン
```

### 2. IPアドレス直接入力
```bash
# サーバー起動時に表示されるNetwork URLを使用
# 例: http://192.168.1.100:3000
```

## 🗄️ データベース

### 初期データ投入
```bash
# 善行テンプレートをシード
curl -X POST http://localhost:3000/api/seed
```

### Prisma操作
```bash
# データベーススキーマ反映
pnpm db:push

# Prisma Studio起動（データベースGUI）
pnpm db:studio
```

## 🚨 よくある問題と解決法

### ❌ Googleログインエラー
**症状**: Content Security Policy エラー

**解決法**:
1. サーバーを再起動してください
```bash
# サーバー停止 (Ctrl+C)
pnpm dev
```

2. ブラウザキャッシュをクリア
3. シークレットモードで試行

### ❌ QRコードが表示されない
**症状**: ダッシュボードでQRコードが見えない

**解決法**:
1. `/dev/qr` に直接アクセス
2. ログイン不要でQRコード表示

### ❌ スマホからアクセスできない
**症状**: QRコードをスキャンしてもアクセスできない

**解決法**:
1. PCとスマホが同じWiFiに接続されているか確認
2. `pnpm run dev:mobile` でサーバー起動しているか確認
3. ファイアウォール設定を確認

### ❌ データベースエラー
**症状**: 「テンプレートが見つかりません」

**解決法**:
```bash
# データベースをシード
curl -X POST http://localhost:3000/api/seed
```

## 🧪 テスト

### 型チェック
```bash
pnpm type-check
```

### ビルドテスト
```bash
pnpm build
```

### リンター
```bash
pnpm lint
```

## 📊 開発ツール

### Chrome DevTools
- React Developer Tools をインストール推奨
- モバイルビューでレスポンシブテスト

### Firebase Console
- [Firebase Console](https://console.firebase.google.com/)
- プロジェクト: `ichizen-6c9c8`

### Prisma Studio
```bash
pnpm db:studio
```
- http://localhost:5555 でデータベースGUI

## 🔧 カスタマイズ

### 善行テンプレート追加
1. `src/app/api/seed/route.ts` を編集
2. 新しいテンプレートを配列に追加
3. `curl -X POST http://localhost:3000/api/seed` で再シード

### UIテーマ変更
- `tailwind.config.js` の `good` カラーを変更
- `src/app/globals.css` のCSS変数を調整

## 💡 開発のヒント

- 📱 スマホテストは頻繁に行う
- 🔄 ホットリロードが効かない場合はサーバー再起動
- 🗄️ データベースの変更後は `pnpm db:push` を実行
- 🎨 UIの調整は Chrome DevTools のモバイルビューで確認