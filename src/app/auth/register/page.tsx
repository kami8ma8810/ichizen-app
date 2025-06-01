'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { RegisterFormData } from '@/types/auth';
import { authConfig } from '@/config/firebase';

/**
 * 新規登録ページ
 */
export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const { shouldShowContent } = useRedirectIfAuthenticated();

  // デバッグ用ログ
  console.log('🔍 Register Page Debug:', {
    isLoading,
    isAuthenticated: useAuth().isAuthenticated,
    shouldShowContent,
  });

  // フォーム状態
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
  }>({});

  // フォーム入力処理
  const handleInputChange = (field: string, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
  };

  // バリデーション
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.name.trim()) {
      errors.name = '名前を入力してください';
    }

    if (!formData.email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      errors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      errors.password = 'パスワードは6文字以上で入力してください';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'パスワード（確認）を入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'パスワードが一致しません';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = '利用規約に同意してください';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // メール登録処理
  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const registerData: RegisterFormData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      agreeToTerms: formData.agreeToTerms,
    };

    const success = await registerWithEmail(registerData);

    if (success) {
      // メール認証確認画面にリダイレクト（メールアドレスをパラメータで渡す）
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
    }
  };

  // Google登録処理
  const handleGoogleRegister = async (): Promise<void> => {
    const success = await loginWithGoogle();
    if (success) {
      router.push(authConfig.redirects.afterSignIn);
    }
  };

  // 認証済みユーザーまたは認証チェック中の場合の表示制御
  if (isLoading) {
    // 認証状態確認中の表示
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証済みユーザーの場合は何も表示しない（リダイレクトが実行される）
  if (!shouldShowContent) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div className="p-6 space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              アカウント作成
            </h1>
            <p className="text-sm text-gray-600">
              一日一善アプリへようこそ
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* メール登録フォーム */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                名前
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                placeholder="山田太郎"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                placeholder="example@gmail.com"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                placeholder="6文字以上"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="パスワードを再入力"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* 利用規約同意 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('agreeToTerms', e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  利用規約に同意します
                </span>
              </label>
              {validationErrors.agreeToTerms && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.agreeToTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          {/* Google登録 */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Googleで登録</span>
          </button>

          {/* ログインリンク */}
          <div className="text-center text-sm text-gray-600">
            すでにアカウントをお持ちですか？{' '}
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