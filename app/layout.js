import './globals.css'
import React from 'react'
import Header from './components/Header'

export const metadata = {
  title: 'iT4P studio',
  description: 'A modern portfolio site using Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className="flex flex-col min-h-screen">
      <body className="flex flex-col flex-grow">
        {/* 全ページ共通のヘッダー */}
        <Header />

        {/* ページごとの内容 */}
        <main className="flex-grow overflow-hidden">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-white/10 bg-black py-4 text-center text-gray-500">
          © Copyright iT4P studio All rights reserved.
        </footer>
      </body>
    </html>
  )
}
