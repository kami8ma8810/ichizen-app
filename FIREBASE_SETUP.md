# 🔧 Firebase設定手順

## 匿名認証の有効化

### 1. Firebase Consoleにアクセス
https://console.firebase.google.com/

### 2. プロジェクトを選択
プロジェクトID: `ichizen-6c9c8`

### 3. Authenticationの設定
1. 左メニューから **「Authentication」** を選択
2. **「Sign-in method」** タブをクリック
3. 下記の認証方法を有効化：

#### ✅ 有効にする認証方法
- **Anonymous** ✅ ←← **これが必須！**
- **Google** ✅
- **Email/Password** ✅

#### ❌ 無効のままでOK
- Facebook
- Twitter
- GitHub
- Apple
- Microsoft
- Yahoo

### 4. 設定確認
匿名認証が有効化されると：
- 「今すぐ始める」ボタンが正常動作
- ユーザー登録なしでアプリ利用可能

### 5. トラブルシューティング

#### `auth/admin-restricted-operation` エラー
→ 匿名認証が無効化されています。上記手順3で有効化してください。

#### `auth/network-request-failed` エラー
→ Firebase設定（API Key等）に問題があります。

#### その他のエラー
→ Firebase Consoleの「Authentication > Users」でユーザー作成状況を確認してください。

---

## 開発環境での確認

アプリで以下を確認してください：
1. ブラウザの開発者コンソールでエラーログをチェック
2. 「🔧 Firebase接続テスト」ページで設定状況を確認
3. 「今すぐ始める」ボタンクリック後、ダッシュボードに遷移するかテスト