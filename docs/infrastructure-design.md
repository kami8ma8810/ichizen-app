# 🌐 インフラ設計書

## 📝 概要

一日一善アプリを**グローバルスケール**で運用するため、**マルチリージョン対応**のインフラ設計を採用します。高可用性、パフォーマンス、災害復旧を考慮した堅牢な基盤を構築します。

---

## 🏗️ アーキテクチャ概要

```
                           🌍 Global Load Balancer
                           (Cloud Load Balancing)
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                🇯🇵 Asia          🇺🇸 US          🇪🇺 Europe
            (Tokyo/Osaka)      (us-central)    (europe-west)
                    │               │               │
                ┌───┴───┐       ┌───┴───┐       ┌───┴───┐
                │ CDN   │       │ CDN   │       │ CDN   │
                │ Cache │       │ Cache │       │ Cache │
                └───┬───┘       └───┬───┘       └───┬───┘
                    │               │               │
            ┌───────┴───────┐ ┌─────┴─────┐ ┌───────┴───────┐
            │ Cloud Run     │ │Cloud Run  │ │ Cloud Run     │
            │ Auto-scaling  │ │Auto-scale │ │ Auto-scaling  │ 
            └───────┬───────┘ └─────┬─────┘ └───────┬───────┘
                    │               │               │
        ┌───────────┴─────────────┬─┴─────────────┬─┴───────────────┐
        │                         │               │                 │
    ┌───▼───┐               ┌─────▼─────┐   ┌─────▼─────┐       ┌───▼───┐
    │ DB    │               │ Primary   │   │ Read      │       │ Redis │
    │ Read  │               │ CloudSQL  │   │ Replica   │       │ Cluster│
    │Replica│               │ (Master)  │   │ CloudSQL  │       │       │
    └───────┘               └───────────┘   └───────────┘       └───────┘
```

---

## 🌐 1. マルチリージョンVPC設計

### 地域分散戦略

#### プライマリリージョン: `asia-northeast1` (東京)
```yaml
# メインリージョン設定
primary_region:
  name: "asia-northeast1"
  zones:
    - "asia-northeast1-a"
    - "asia-northeast1-b" 
    - "asia-northeast1-c"
  services:
    - Cloud Run (メインアプリ)
    - Cloud SQL (マスターDB)
    - Redis Memorystore
    - Firebase (認証・Firestore)
  user_base: "日本・アジア太平洋"
```

#### セカンダリリージョン: `us-central1` (アメリカ)
```yaml
# セカンダリリージョン設定
secondary_region:
  name: "us-central1"
  zones:
    - "us-central1-a"
    - "us-central1-b"
    - "us-central1-c"
  services:
    - Cloud Run (副アプリ)
    - Cloud SQL (読み取りレプリカ)
    - Redis Memorystore
  user_base: "北米・南米"
```

#### ターシャリリージョン: `europe-west1` (ヨーロッパ)
```yaml
# ヨーロッパリージョン設定
tertiary_region:
  name: "europe-west1"
  zones:
    - "europe-west1-b"
    - "europe-west1-c"
    - "europe-west1-d"
  services:
    - Cloud Run (副アプリ)
    - Cloud SQL (読み取りレプリカ)
    - Redis Memorystore
  user_base: "ヨーロッパ・アフリカ・中東"
```

### VPCネットワーク設計

```yaml
# VPCネットワーク設定
vpc_network:
  name: "ichizen-global-vpc"
  subnets:
    # メインリージョン
    - name: "asia-northeast1-subnet"
      region: "asia-northeast1"
      ip_range: "10.1.0.0/16"
      
    # セカンダリリージョン  
    - name: "us-central1-subnet"
      region: "us-central1"
      ip_range: "10.2.0.0/16"
      
    # ターシャリリージョン
    - name: "europe-west1-subnet" 
      region: "europe-west1"
      ip_range: "10.3.0.0/16"

  # プライベート接続
  private_service_connect:
    - Cloud SQL
    - Redis Memorystore
    - Firebase

  # ファイアウォール設定
  firewall_rules:
    - name: "allow-cloud-run"
      direction: "INGRESS"
      source_ranges: ["0.0.0.0/0"]
      allowed_ports: ["80", "443"]
      
    - name: "allow-internal"
      direction: "INGRESS" 
      source_ranges: ["10.0.0.0/8"]
      allowed_ports: ["all"]
```

---

## ⚡ 2. Global Load Balancer設定

### Cloud Load Balancing構成

```yaml
# グローバルロードバランサー設定
global_load_balancer:
  name: "ichizen-global-lb"
  type: "HTTPS"
  
  # SSL証明書
  ssl_certificates:
    - managed_certificate:
        domains:
          - "ichizen-app.com"
          - "api.ichizen-app.com"
          - "www.ichizen-app.com"
  
  # バックエンドサービス
  backend_services:
    - name: "asia-backend"
      region: "asia-northeast1"
      protocol: "HTTPS"
      port: 443
      health_check:
        path: "/api/health"
        interval: 30
        timeout: 10
        
    - name: "us-backend"
      region: "us-central1" 
      protocol: "HTTPS"
      port: 443
      health_check:
        path: "/api/health"
        interval: 30
        timeout: 10
        
    - name: "europe-backend"
      region: "europe-west1"
      protocol: "HTTPS" 
      port: 443
      health_check:
        path: "/api/health"
        interval: 30
        timeout: 10

  # トラフィック分散ポリシー
  traffic_policy:
    geo_routing:
      - region: "asia"
        backend: "asia-backend"
        weight: 100
        
      - region: "us"
        backend: "us-backend" 
        weight: 100
        
      - region: "europe"
        backend: "europe-backend"
        weight: 100
    
    # フェイルオーバー設定
    failover:
      primary: "asia-backend"
      secondary: ["us-backend", "europe-backend"]
      health_threshold: 50
```

### レイテンシベースルーティング

```typescript
// 地理的ルーティング設定
export const GEO_ROUTING_CONFIG = {
  'asia-northeast1': {
    countries: ['JP', 'KR', 'CN', 'TW', 'SG', 'TH', 'VN'],
    latency_threshold: 100, // ms
  },
  'us-central1': {
    countries: ['US', 'CA', 'MX', 'BR', 'AR'],
    latency_threshold: 150, // ms
  },
  'europe-west1': {
    countries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL'],
    latency_threshold: 120, // ms
  },
} as const;

// 動的ルーティングロジック
export function selectOptimalRegion(
  userLocation: string,
  regionLatencies: Record<string, number>
): string {
  // 1. 地理的な優先度
  const preferredRegion = getPreferredRegionByCountry(userLocation);
  
  // 2. レイテンシチェック
  const optimalRegion = Object.entries(regionLatencies)
    .sort(([,a], [,b]) => a - b)
    .find(([region, latency]) => 
      latency < GEO_ROUTING_CONFIG[region]?.latency_threshold
    )?.[0];
  
  return optimalRegion || preferredRegion || 'asia-northeast1';
}
```

---

## 🌐 3. CloudFlare CDN設定

### CloudFlare設定

```yaml
# CloudFlare CDN設定
cloudflare:
  zones:
    - name: "ichizen-app.com"
      plan: "Pro" # または Business
      
  # キャッシュルール
  page_rules:
    - pattern: "ichizen-app.com/static/*"
      settings:
        cache_level: "cache_everything"
        edge_cache_ttl: 2592000 # 30日
        
    - pattern: "ichizen-app.com/api/templates"
      settings:
        cache_level: "cache_everything" 
        edge_cache_ttl: 3600 # 1時間
        
    - pattern: "ichizen-app.com/api/auth/*"
      settings:
        cache_level: "bypass"
        
  # DDoS対策
  security:
    ddos_protection: true
    bot_management: true
    rate_limiting:
      - name: "api_rate_limit"
        pattern: "ichizen-app.com/api/*"
        threshold: 100 # requests per minute
        period: 60
        action: "challenge"
        
  # SSL設定
  ssl:
    mode: "full_strict"
    universal_ssl: true
    min_tls_version: "1.2"
    
  # パフォーマンス最適化
  performance:
    minification:
      css: true
      html: true
      js: true
    brotli: true
    http2: true
    http3: true
```

### エッジキャッシュ戦略

```typescript
// キャッシュ戦略定義
export const CACHE_STRATEGY = {
  // 静的アセット
  static_assets: {
    pattern: '/static/*',
    ttl: 2592000, // 30日
    cache_control: 'public, max-age=2592000, immutable',
  },
  
  // 善行テンプレート
  templates: {
    pattern: '/api/templates*',
    ttl: 3600, // 1時間
    cache_control: 'public, max-age=3600',
    vary: ['Accept-Language'],
  },
  
  // ユーザーデータ
  user_data: {
    pattern: '/api/user/*',
    ttl: 0, // キャッシュしない
    cache_control: 'private, no-cache',
  },
  
  // 画像
  images: {
    pattern: '/images/*',
    ttl: 604800, // 7日
    cache_control: 'public, max-age=604800',
    formats: ['webp', 'avif'], // 最適化フォーマット
  },
} as const;
```

---

## 📈 4. Auto-scaling設定

### Cloud Run Auto-scaling

```yaml
# Cloud Run設定
cloud_run_services:
  - name: "ichizen-app-asia"
    region: "asia-northeast1"
    image: "gcr.io/ichizen-app/app:latest"
    
    # Auto-scaling設定
    scaling:
      min_instances: 1  # 常時1インスタンス
      max_instances: 100 # 最大100インスタンス
      concurrency: 80   # 1インスタンスあたり80リクエスト
      cpu_throttling: false
      
    # リソース設定
    resources:
      cpu: "2"      # 2 vCPU
      memory: "4Gi" # 4GB RAM
      
    # 環境変数
    env_vars:
      - name: "REGION"
        value: "asia-northeast1"
      - name: "ENVIRONMENT" 
        value: "production"
        
  - name: "ichizen-app-us"
    region: "us-central1"
    # 同様の設定...
    
  - name: "ichizen-app-europe"
    region: "europe-west1" 
    # 同様の設定...
```

### スケーリングメトリクス

```typescript
// スケーリングトリガー設定
export const SCALING_METRICS = {
  // CPUベース
  cpu_utilization: {
    target: 70, // 70%でスケールアップ
    scale_up_threshold: 2, // 2分間継続
    scale_down_threshold: 5, // 5分間継続
  },
  
  // メモリベース  
  memory_utilization: {
    target: 80, // 80%でスケールアップ
    scale_up_threshold: 1, // 1分間継続
    scale_down_threshold: 3, // 3分間継続
  },
  
  // リクエストベース
  request_count: {
    target: 50, // インスタンスあたり50req/sec
    scale_up_threshold: 1, // 1分間継続
    scale_down_threshold: 5, // 5分間継続
  },
  
  // レスポンス時間ベース
  response_latency: {
    target: 500, // 500ms以上でスケールアップ  
    scale_up_threshold: 2, // 2分間継続
    scale_down_threshold: 10, // 10分間継続
  },
} as const;

// 自動スケーリングロジック
export class AutoScaler {
  async evaluateScaling(
    currentMetrics: MetricsData,
    region: string
  ): Promise<ScalingDecision> {
    const decisions: ScalingDecision[] = [];
    
    // CPU使用率チェック
    if (currentMetrics.cpu > SCALING_METRICS.cpu_utilization.target) {
      decisions.push({
        action: 'scale_up',
        reason: 'high_cpu',
        instances: this.calculateRequiredInstances(currentMetrics.cpu, 'cpu')
      });
    }
    
    // メモリ使用率チェック
    if (currentMetrics.memory > SCALING_METRICS.memory_utilization.target) {
      decisions.push({
        action: 'scale_up', 
        reason: 'high_memory',
        instances: this.calculateRequiredInstances(currentMetrics.memory, 'memory')
      });
    }
    
    // 最も積極的なスケーリング決定を採用
    return decisions.reduce((prev, curr) => 
      curr.instances > prev.instances ? curr : prev
    );
  }
}
```

---

## 🔐 5. セキュリティ設計

### WAF (Web Application Firewall)

```yaml
# Cloud Armor設定
cloud_armor:
  security_policies:
    - name: "ichizen-security-policy"
      rules:
        # DDoS対策
        - priority: 1000
          match:
            version_expr: 
              expr: "origin.region_code == 'CN'"
          action: "rate_based_ban"
          rate_limit_options:
            conform_action: "allow"
            exceed_action: "deny_403"
            enforce_on_key: "IP"
            rate_limit_threshold:
              count: 100
              interval_sec: 60
              
        # SQL Injection対策
        - priority: 2000
          match:
            expr: |
              has(request.headers['user-agent']) && 
              request.headers['user-agent'].contains('sqlmap')
          action: "deny_403"
          
        # Bot対策
        - priority: 3000
          match:
            expr: |
              !has(request.headers['user-agent']) ||
              request.headers['user-agent'].size() < 10
          action: "deny_403"
```

### ネットワークセキュリティ

```yaml
# ファイアウォール設定
firewall_rules:
  # Cloud Run向けトラフィック許可
  - name: "allow-cloud-run-ingress"
    direction: "INGRESS"
    source_ranges: ["130.211.0.0/22", "35.191.0.0/16"] # GCP Load Balancer
    target_tags: ["cloud-run"]
    allowed:
      - protocol: "tcp"
        ports: ["80", "443"]
        
  # 内部通信許可  
  - name: "allow-internal-communication"
    direction: "INGRESS"
    source_ranges: ["10.0.0.0/8"]
    target_tags: ["internal"]
    allowed:
      - protocol: "tcp"
        ports: ["0-65535"]
        
  # SSH接続制限
  - name: "allow-ssh-from-bastion"
    direction: "INGRESS" 
    source_tags: ["bastion-host"]
    target_tags: ["compute-instance"]
    allowed:
      - protocol: "tcp"
        ports: ["22"]
```

---

## 📊 6. 監視・アラート設定

### 重要メトリクス

```typescript
// 監視対象メトリクス
export const MONITORING_METRICS = {
  // インフラメトリクス
  infrastructure: {
    'compute.googleapis.com/instance/cpu/utilization': 'CPU使用率',
    'run.googleapis.com/container/memory/utilizations': 'メモリ使用率', 
    'run.googleapis.com/request_count': 'リクエスト数',
    'run.googleapis.com/request_latencies': 'レスポンス時間',
  },
  
  // データベースメトリクス
  database: {
    'cloudsql.googleapis.com/database/cpu/utilization': 'DB CPU使用率',
    'cloudsql.googleapis.com/database/memory/utilization': 'DBメモリ使用率',
    'cloudsql.googleapis.com/database/network/connections': 'DB接続数',
  },
  
  // ビジネスメトリクス
  business: {
    'custom.googleapis.com/user/daily_active_users': '日次アクティブユーザー',
    'custom.googleapis.com/activity/completion_rate': '善行完了率',
    'custom.googleapis.com/user/retention_rate': 'ユーザー継続率',
  },
} as const;
```

### アラート設定

```yaml
# アラートポリシー
alerting_policies:
  # 高負荷アラート
  - name: "High CPU Utilization"
    conditions:
      - display_name: "Cloud Run CPU > 80%"
        condition_threshold:
          filter: 'resource.type="cloud_run_revision"'
          comparison: "COMPARISON_GREATER_THAN"
          threshold_value: 0.8
          duration: 300s # 5分間継続
    notification_channels:
      - "slack-ops-channel"
      - "email-oncall"
      
  # エラー率アラート  
  - name: "High Error Rate"
    conditions:
      - display_name: "Error Rate > 5%"
        condition_threshold:
          filter: 'resource.type="cloud_run_revision"'
          comparison: "COMPARISON_GREATER_THAN" 
          threshold_value: 0.05
          duration: 180s # 3分間継続
    notification_channels:
      - "pagerduty-urgent"
      - "slack-ops-channel"
      
  # ビジネスメトリクスアラート
  - name: "Low User Activity"  
    conditions:
      - display_name: "DAU decrease > 20%"
        condition_threshold:
          filter: 'metric.type="custom.googleapis.com/user/daily_active_users"'
          comparison: "COMPARISON_LESS_THAN"
          threshold_value: 1000 # 最低1000DAU
          duration: 3600s # 1時間継続
    notification_channels:
      - "slack-business-channel"
      - "email-product-team"
```

この設計により、**グローバルスケールでの高可用性・高パフォーマンス**を実現し、数十万ユーザーの同時利用にも対応できるインフラ基盤が構築されます。

---

## ✅ Phase 1完了チェックリスト

### 1.1 マルチデータベース設計
- ✅ Firestore設計（リアルタイムデータ）
- ✅ CloudSQL設計（分析・集計データ）  
- ✅ Redis設計（キャッシュ・セッション）
- ✅ データ同期パイプライン設計

### 1.2 インフラ設計  
- ✅ マルチリージョンVPC設計
- ✅ Global Load Balancer設定
- ✅ CloudFlare CDN設定
- ✅ Auto-scaling設定

**次はPhase 2: 認証・セキュリティに進みます！** 🚀 