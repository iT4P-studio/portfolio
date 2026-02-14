import './globals.css'
import React from 'react'
import Script from 'next/script'
import Header from './components/Header'

const SITE_URL = 'https://it4pstudio.com'
const SITE_NAME = 'iT4P studio'
const REP_NAME = '板𠩤豪士'
const REP_NAME_ALT = '板原豪士'
const REP_NAME_ROMAN = 'GOSHI ITAHARA'
const SITE_NAME_WITH_REP = `${REP_NAME_ALT}｜${SITE_NAME}`
const DEFAULT_DESCRIPTION = 'スポーツ・イベント・ステージ撮影から映像制作まで対応するフォト/ムービースタジオ。'
const GTM_ID = 'GTM-K3GC8P7R'
const GA_MEASUREMENT_ID = 'G-GVJZVJ676G'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME_WITH_REP,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME_WITH_REP,
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
        '@type': 'Person',
        name: REP_NAME,
        alternateName: [REP_NAME_ALT, REP_NAME_ROMAN],
        jobTitle: '代表',
        worksFor: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        url: SITE_URL,
        sameAs: ['https://x.com/it4p_studio', 'https://www.instagram.com/it4hara5a/'],
      },
      {
        '@type': 'WebSite',
        name: SITE_NAME_WITH_REP,
        alternateName: [SITE_NAME, REP_NAME_ALT, REP_NAME_ROMAN],
        url: SITE_URL,
      },
    ],
  }

  return (
    <html lang="ja" className="flex flex-col min-h-screen">
      <body className="flex flex-col flex-grow">
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js',gaMeasurementId:'${GA_MEASUREMENT_ID}'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
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
