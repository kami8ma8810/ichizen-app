# 🗄️ マルチデータベース設計書

## 📝 概要

一日一善アプリでは、データの特性と用途に応じて3つのデータベースを使い分けることで、**スケーラビリティ**と**パフォーマンス**を最適化します。

## 🏗️ アーキテクチャ概要

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firestore     │    │   PostgreSQL    │    │     Redis       │
│ (リアルタイム)   │    │   (分析・集計)   │    │  (キャッシュ)    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • リアルタイム  │    │ • 複雑な分析    │    │ • セッション     │
│ • 通知          │    │ • レポート      │    │ • 一時データ     │
│ • 即座の更新    │    │ • 集計処理      │    │ • レート制限     │
│ • 同期処理      │    │ • 履歴データ    │    │ • キャッシュ     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔥 1. Firestore設計（リアルタイムデータ）

### 用途
- **リアルタイム性が必要なデータ**
- **即座の同期が必要な操作**
- **プッシュ通知**
- **リアルタイムUI更新**

### コレクション設計

#### 📱 `users/{userId}` - ユーザー基本情報
```typescript
interface UserDoc {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  firebaseUid: string;
  settings: {
    notificationTime?: string;
    timezone: string;
    language: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}
```

#### 📅 `users/{userId}/activities/{activityId}` - 今日の善行
```typescript
interface ActivityDoc {
  id: string;
  templateId: string;
  date: string; // YYYY-MM-DD形式
  status: 'COMPLETED' | 'SKIPPED' | 'PLANNED';
  note?: string;
  mood?: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'BAD';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 🔔 `users/{userId}/notifications/{notificationId}` - 通知キュー
```typescript
interface NotificationDoc {
  id: string;
  type: 'REMINDER' | 'BADGE' | 'STREAK' | 'COMMUNITY';
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduledFor: Timestamp;
  sentAt?: Timestamp;
  isRead: boolean;
  createdAt: Timestamp;
}
```

#### 🏆 `users/{userId}/streaks/current` - 現在のストリーク
```typescript
interface CurrentStreakDoc {
  count: number;
  startDate: Timestamp;
  lastActivityDate: string; // YYYY-MM-DD
  isActive: boolean;
  updatedAt: Timestamp;
}
```

#### 🎯 `goodDeedTemplates/{templateId}` - 善行テンプレート
```typescript
interface GoodDeedTemplateDoc {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### セキュリティルール例
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /activities/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /notifications/{notificationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // 善行テンプレートは全ユーザー読み取り可能
    match /goodDeedTemplates/{templateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.admin == true; // 管理者のみ
    }
  }
}
```

---

## 🐘 2. PostgreSQL設計（分析・集計データ）

### 用途
- **複雑な分析クエリ**
- **集計・レポート処理**
- **履歴データ保管**
- **バッチ処理**

### テーブル設計（Prismaスキーマより）

#### 分析用ビュー例
```sql
-- 月次統計ビュー
CREATE VIEW monthly_statistics AS
SELECT 
  DATE_TRUNC('month', date) as month,
  COUNT(*) as total_activities,
  COUNT(DISTINCT user_id) as active_users,
  AVG(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completion_rate
FROM activities 
GROUP BY DATE_TRUNC('month', date);

-- カテゴリ別人気度
CREATE VIEW category_popularity AS
SELECT 
  gdt.category,
  COUNT(a.id) as activity_count,
  COUNT(DISTINCT a.user_id) as unique_users
FROM activities a
JOIN good_deed_templates gdt ON a.template_id = gdt.id
GROUP BY gdt.category
ORDER BY activity_count DESC;
```

### インデックス戦略
```sql
-- パフォーマンス最適化用インデックス
CREATE INDEX idx_activities_user_date ON activities(user_id, date);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_templates_category ON good_deed_templates(category);
CREATE INDEX idx_templates_active ON good_deed_templates(is_active);
```

---

## 🔴 3. Redis設計（キャッシュ・セッション）

### 用途
- **セッション管理**
- **レート制限**
- **一時的なキャッシュ**
- **リアルタイム集計**

### キー設計

#### セッション管理
```
session:{sessionId} -> JSON (ユーザー情報)
TTL: 30日
```

#### レート制限
```
rate_limit:api:{userId}:{endpoint} -> カウント
TTL: 1時間

rate_limit:notification:{userId} -> カウント  
TTL: 1日
```

#### 今日の善行キャッシュ
```
daily_template:{date} -> templateId
TTL: 24時間

user_activity:{userId}:{date} -> ActivityDoc JSON
TTL: 24時間
```

#### ストリーク情報キャッシュ
```
streak:{userId} -> JSON (ストリーク情報)
TTL: 1時間
```

#### 人気テンプレートキャッシュ
```
popular_templates:{category}:{timeframe} -> Array<templateId>
TTL: 6時間
```

### Redis設定例
```typescript
// Redis接続設定
interface RedisConfig {
  url: string;
  password?: string;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
  lazyConnect: true;
  keepAlive: 30000;
}

// TTL設定
export const TTL = {
  SESSION: 30 * 24 * 60 * 60, // 30日
  RATE_LIMIT_HOUR: 60 * 60, // 1時間
  RATE_LIMIT_DAY: 24 * 60 * 60, // 1日
  DAILY_CACHE: 24 * 60 * 60, // 24時間
  STREAK_CACHE: 60 * 60, // 1時間
  POPULAR_CACHE: 6 * 60 * 60, // 6時間
} as const;
```

---

## 🔄 4. データ同期パイプライン

### 同期戦略

#### リアルタイム同期（Firestore → PostgreSQL）
```typescript
// Cloud Functionsトリガー例
export const syncActivityToPostgreSQL = functions.firestore
  .document('users/{userId}/activities/{activityId}')
  .onWrite(async (change, context) => {
    const { userId, activityId } = context.params;
    
    if (change.after.exists) {
      // データ作成・更新
      const data = change.after.data();
      await syncToPostgreSQL('activities', {
        id: activityId,
        userId,
        ...data
      });
    } else {
      // データ削除
      await deleteFromPostgreSQL('activities', activityId);
    }
  });
```

#### バッチ同期（PostgreSQL → Redis キャッシュ更新）
```typescript
// 定期実行バッチ（Cloud Scheduler + Cloud Run）
export async function updateRedisCache() {
  // 人気テンプレートを計算してキャッシュ
  const popularTemplates = await db.goodDeedTemplate.findMany({
    orderBy: { usageCount: 'desc' },
    take: 10,
    where: { isActive: true }
  });
  
  await redis.setex(
    'popular_templates:all:weekly',
    TTL.POPULAR_CACHE,
    JSON.stringify(popularTemplates.map(t => t.id))
  );
}
```

### データ整合性確保

#### 分散トランザクション戦略
```typescript
// Firestoreライトとキャッシュ更新
export async function recordActivity(
  userId: string, 
  activityData: ActivityData
) {
  const batch = db.batch();
  
  try {
    // 1. Firestoreに書き込み
    const activityRef = db.collection(`users/${userId}/activities`).doc();
    batch.set(activityRef, activityData);
    
    // 2. ストリーク更新
    const streakRef = db.collection(`users/${userId}/streaks`).doc('current');
    batch.update(streakRef, {
      count: admin.firestore.FieldValue.increment(1),
      lastActivityDate: activityData.date,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    await batch.commit();
    
    // 3. キャッシュ更新
    await redis.del(`user_activity:${userId}:${activityData.date}`);
    await redis.del(`streak:${userId}`);
    
  } catch (error) {
    // ロールバック処理
    console.error('Activity recording failed:', error);
    throw error;
  }
}
```

---

## 📈 スケーラビリティ考慮事項

### 1. 読み取り最適化
- **Redis**で頻繁なクエリをキャッシュ
- **Firestore**でリアルタイムデータ取得
- **PostgreSQL**で複雑な分析クエリ

### 2. 書き込み最適化
- **Firestore**バッチライトの活用
- **PostgreSQL**バルクインサート
- **非同期処理**での負荷分散

### 3. 地理的分散
- **Multi-region Firestore**
- **Cloud SQL読み取りレプリカ**
- **Redis Cluster**での地域分散

### 4. 監視・メトリクス
```typescript
// 重要メトリクス
export const METRICS = {
  // データベース
  'db.firestore.reads_per_minute': 'Firestoreリード数/分',
  'db.firestore.writes_per_minute': 'Firestoreライト数/分',
  'db.postgresql.connection_pool_usage': 'PostgreSQL接続プール使用率',
  'db.redis.memory_usage': 'Redisメモリ使用量',
  
  // アプリケーション
  'app.activity_record_latency': '善行記録レイテンシ',
  'app.cache_hit_rate': 'キャッシュヒット率',
  'app.sync_lag': '同期遅延',
} as const;
```

この設計により、**数万〜数十万ユーザー**での利用にも対応できるスケーラブルなデータベース基盤が構築されます。 