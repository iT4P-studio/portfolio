import './globals.css'
import React from 'react'
import Header from './components/Header'

export const metadata = {
  title: 'My Portfolio',
  description: 'A modern portfolio site using Next.js',
  // viewport: 'width=device-width, initial-scale=1.0', 
  // もしメタタグとしてviewportを追加したい場合はコメントアウトを外してください。
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {/* 全ページ共通のヘッダーを表示 */}
        <Header />

        {/* ページごとの内容を表示 */}
        <main>{children}</main>
      </body>
    </html>
  )
}
