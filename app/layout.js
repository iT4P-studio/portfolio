import './globals.css'
import React from 'react'
import Header from './components/Header'

export const metadata = {
  title: 'My Portfolio',
  description: 'A modern portfolio site using Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {/* 全ページ共通のヘッダー */}
        <Header />

        {/* ページごとの内容 */}
        <main className="overflow-hidden">{children}</main>
      </body>
    </html>
  )
}
