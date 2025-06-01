'use client';

import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { auth } from '@/lib/firebase';
import { validateFirebaseConfig } from '@/config/firebase';
import type { User } from 'firebase/auth';

const TestFirebasePage: FC = () => {
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [authStatus, setAuthStatus] = useState<string>('確認中...');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // 環境変数の値をデバッグ表示
    const envDebug = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] || 'undefined',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || 'undefined',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || 'undefined',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || 'undefined',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || 'undefined',
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'] || 'undefined',
    };
    
    setDebugInfo(JSON.stringify(envDebug, null, 2));
    console.log('🔍 環境変数デバッグ:', envDebug);

    // Firebase設定の確認
    const isConfigValid = validateFirebaseConfig();
    
    if (!isConfigValid) {
      setFirebaseStatus('error');
      return;
    }

    // Firebase Auth接続確認
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        setAuthStatus(`ログイン済み: ${user.email || 'Anonymous'}`);
      } else {
        setAuthStatus('未ログイン');
      }
      setFirebaseStatus('success');
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Firebase接続テスト
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Firebase設定状況
            </h3>
            <div className="flex items-center space-x-2">
              {firebaseStatus === 'loading' && (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-600">確認中...</span>
                </>
              )}
              {firebaseStatus === 'success' && (
                <>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">接続成功</span>
                </>
              )}
              {firebaseStatus === 'error' && (
                <>
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-red-600">設定エラー</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">
              認証状況
            </h3>
            <p className="text-gray-600">{authStatus}</p>
          </div>

          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">
              環境変数デバッグ情報
            </h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {debugInfo}
            </pre>
          </div>

          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-2">
              プロジェクト情報
            </h3>
            <p className="text-sm text-gray-600">
              プロジェクトID: <code className="bg-gray-100 px-1 rounded">ichizen-6c9c8</code>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestFirebasePage; 