'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authConfig } from '@/config/firebase';

/**
 * メール認証確認ページ
 */
export default function VerifyEmailPage(): React.JSX.Element {
  const router = useRouter();
  
  // 本番環境では認証ページをブロック
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/');
    }
  }, [router]);
  
  const { isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>('');

  // URLパラメータからメールアドレスを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  // 認証確認メール再送信
  const handleResendEmail = async (): Promise<void> => {
    try {
      setIsResending(true);
      setResendMessage('');
      clearError();

      const { getFirebaseAuth } = await import('@/lib/firebase');
      const { sendEmailVerification } = await import('firebase/auth');
      
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;

      if (currentUser && !currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        setResendMessage('確認メールを再送信しました。メールボックスをご確認ください。');
      } else {
        setResendMessage('メール認証は既に完了しているか、ユーザーが見つかりません。');
      }
    } catch (error: any) {
      console.error('❌ メール再送信エラー:', error);
      setResendMessage('メールの再送信に失敗しました。しばらくしてから再度お試しください。');
    } finally {
      setIsResending(false);
    }
  };

  // ダッシュボードに進む
  const handleContinue = (): void => {
    router.push(authConfig.redirects.afterSignIn);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6 space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              メールをご確認ください
            </h1>
            <p className="text-sm text-gray-600">
              アカウントの作成が完了しました
            </p>
          </div>

          {/* メッセージ */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">確認メールを送信しました</p>
              <p className="mb-2">
                {email && (
                  <>
                    <span className="font-medium">{email}</span> に確認メールを送信しました。
                  </>
                )}
              </p>
              <p>
                メール内のリンクをクリックして、メールアドレスの確認を完了してください。
              </p>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* 再送信メッセージ */}
          {resendMessage && (
            <div className={`p-3 text-sm rounded-md border ${
              resendMessage.includes('再送信しました') 
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-orange-700 bg-orange-50 border-orange-200'
            }`}>
              {resendMessage}
            </div>
          )}

          {/* アクション */}
          <div className="space-y-3">
            {/* メール再送信 */}
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isResending || isLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? '送信中...' : 'メールを再送信'}
            </button>

            {/* ダッシュボードに進む */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              メール確認後、続行する
            </button>
          </div>

          {/* 注意事項 */}
          <div className="text-xs text-gray-500 space-y-2">
            <p>📧 メールが届かない場合：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>迷惑メールフォルダをご確認ください</li>
              <li>メールアドレスに間違いがないかご確認ください</li>
              <li>しばらく待ってから「メールを再送信」をお試しください</li>
            </ul>
          </div>

          {/* ログインリンク */}
          <div className="text-center text-sm text-gray-600 border-t pt-4">
            既にメール認証をお済みですか？{' '}
            <Link
              href="/auth/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 