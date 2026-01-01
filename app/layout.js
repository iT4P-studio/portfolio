import './globals.css'
import React from 'react'
import Header from './components/Header'

const SITE_URL = 'https://it4pstudio.com'
const SITE_NAME = 'iT4P studio'
const DEFAULT_DESCRIPTION = 'スポーツ・イベント・ステージ撮影から映像制作まで対応するフォト/ムービースタジオ。'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo_W.png`,
        sameAs: ['https://x.com/it4p_studio', 'https://www.instagram.com/it4hara5a/'],
      },
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  }

  return (
    <html lang="ja" className="flex flex-col min-h-screen">
      <body className="flex flex-col flex-grow">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
