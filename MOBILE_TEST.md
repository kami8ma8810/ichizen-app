# 📱 モバイルテストチェックリスト

## 🚀 簡単セットアップ（QRコード使用）
```bash
# 1. モバイル開発サーバー起動
pnpm run dev:mobile

# 2. ブラウザで http://localhost:3000 にアクセス
# 3. 「📱 スマホテスト（QRコード）」ボタンをクリック
# 4. QRコードが表示されるのでスマホでスキャン
# 5. データベースシード
curl -X POST http://192.168.x.x:3000/api/seed
```

## 📱 QRコード機能
- ✅ ダッシュボードに自動でQRコード表示
- ✅ スマホカメラでスキャンするだけでアクセス
- ✅ ネットワークURL自動検出
- ✅ 開発環境でのみ表示（本番では非表示）

## テスト項目

### ✅ レイアウト
- [ ] ヘッダーが適切に表示される
- [ ] ボタンが指で押しやすいサイズ（44px以上）
- [ ] テキストが読みやすい（16px以上）
- [ ] 横スクロールが発生しない

### ✅ 認証
- [ ] ログイン画面がスマホで操作しやすい
- [ ] Googleログインボタンが正常動作
- [ ] メール認証フォームが使いやすい

### ✅ 善行記録
- [ ] カードUIがスマホサイズに適応
- [ ] フォーム入力が快適
- [ ] 気分選択ボタンが押しやすい

### ✅ カレンダー
- [ ] 月表示が見やすい
- [ ] 日付タップが反応する
- [ ] スワイプ操作（将来実装）

### ✅ ストリーク
- [ ] 数値表示が見やすい
- [ ] アイコンが適切なサイズ

### ✅ ナビゲーション
- [ ] ページ間移動がスムーズ
- [ ] 戻るボタンが機能する

## デバイス別テスト
- [ ] iPhone (375px)
- [ ] iPhone Plus (414px)  
- [ ] Android小 (360px)
- [ ] Android大 (412px)
- [ ] タブレット (768px)

## パフォーマンス
- [ ] 初期ロード時間 < 3秒
- [ ] ページ遷移の応答性
- [ ] タッチ操作の反応速度