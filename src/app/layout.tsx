import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Ichizen App - 一日一善',
    template: '%s | Ichizen App',
  },
  description: '毎日1つの善行で、より良い自分と社会を築くアプリケーション',
  keywords: ['善行', '習慣化', '日本語', 'ライフスタイル', '自己改善'],
  authors: [{ name: 'Ichizen Team' }],
  creator: 'Ichizen Team',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://ichizen-app.vercel.app',
    title: 'Ichizen App - 一日一善',
    description: '毎日1つの善行で、より良い自分と社会を築くアプリケーション',
    siteName: 'Ichizen App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ichizen App - 一日一善',
    description: '毎日1つの善行で、より良い自分と社会を築くアプリケーション',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
} 