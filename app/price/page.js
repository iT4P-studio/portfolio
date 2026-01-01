import React from "react"
import PriceClient from "./PriceClient"

export const metadata = {
  title: "Price",
  description: "撮影・編集の料金プラン。ご依頼内容に合わせて柔軟にご提案します。",
  alternates: {
    canonical: "/price",
  },
  openGraph: {
    title: "Price",
    description: "撮影・編集の料金プラン。ご依頼内容に合わせて柔軟にご提案します。",
    url: "/price",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "iT4P studio Price",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Price",
    description: "撮影・編集の料金プラン。ご依頼内容に合わせて柔軟にご提案します。",
    images: ["/og.jpg"],
  },
}

export default function PricePage() {
  return <PriceClient />
}
