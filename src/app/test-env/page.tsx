'use client';

import type { FC } from 'react';

const TestEnvPage: FC = () => {
  const envVars = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': process.env['NEXT_PUBLIC_FIREBASE_API_KEY'],
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'],
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
    'NEXT_PUBLIC_FIREBASE_APP_ID': process.env['NEXT_PUBLIC_FIREBASE_APP_ID'],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          環境変数テスト
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">クライアントサイド環境変数</h2>
          
          <div className="space-y-3">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm text-gray-600">{key}:</span>
                <span className={`font-mono text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? `${value.slice(0, 20)}...` : '未設定'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>テスト結果:</strong> {
                Object.values(envVars).every(v => v) 
                  ? '✅ すべての環境変数が正常に読み込まれています' 
                  : '❌ 一部の環境変数が読み込まれていません'
              }
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <a 
            href="/auth/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            ログインページに移動
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestEnvPage; 