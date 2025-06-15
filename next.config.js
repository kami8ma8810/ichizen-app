/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Server Components有効化
  experimental: {
    // Partial Prerendering有効化 (canary版のみ)
    // ppr: true,
    // Server Actions有効化
    serverActions: {
      allowedOrigins: ['localhost:3000', 'ichizen-app.vercel.app']
    },
    // より良い開発体験のためのTurbopack
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  },

  // 画像最適化設定
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // パフォーマンス最適化
  compiler: {
    // 本番ビルドでconsole.log削除
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // セキュリティヘッダー
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: isDevelopment ? [
              // 開発環境用（緩い設定）
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google-analytics.com https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://accounts.google.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api.ichizen-app.com https://*.firebaseio.com https://*.googleapis.com https://accounts.google.com https://securetoken.googleapis.com",
              "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
            ].join('; ') : [
              // 本番環境用（厳しい設定）
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google-analytics.com https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://accounts.google.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api.ichizen-app.com https://*.firebaseio.com https://*.googleapis.com https://accounts.google.com",
              "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
            ].join('; ')
          }
        ]
      }
    ]
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ]
  },

  // 環境変数の型チェック
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpackカスタマイズ（バンドル最適化）
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // SVGをReactコンポーネントとして扱う
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    // バンドル分析のための設定
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Output設定（静的最適化）
  output: 'standalone',
  
  // ロギング設定
  logging: {
    fetches: {
      fullUrl: true
    }
  }
};

module.exports = nextConfig; 