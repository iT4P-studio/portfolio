import React from "react"
import Link from "next/link"

export const metadata = {
  title: "Price",
  description: "撮影・編集の料金プラン",
}

export default function PricePage() {
  const plans = [
    {
      title: "写真撮影",
      price: "¥20,000〜/day",
      details: "スポーツ・イベント・ステージ撮影",
      contactLink: "/contact", // お問い合わせページへのリンクを想定
    },
    {
      title: "映像撮影・配信",
      price: "¥25,000〜/day",
      details: "学校行事・各種イベントの収録や配信",
      contactLink: "/contact",
    },
    {
      title: "映像編集",
      price: "¥20,000〜/day",
      details: "撮影データのカット編集、テロップやBGMの追加、After EffectsによるCG",
      contactLink: "/contact",
    },
  ]

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ fontFamily: "'Avenir Next', 'Yu Gothic', sans-serif" }}
      // ↑ フォントを強制的に指定したい場合に使用。 
      // もし既にglobals.css等で全体適用済みなら不要です。
    >
      <h1 className="text-6xl text-white mb-4">Price</h1>
      <p className="text-white mb-8">
        料金は撮影内容等によって大きく変動することがございます。
        ぜひ一度、お気軽にお問い合わせください。
      </p>

      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-stone-700 p-6 flex flex-col items-start"
          >
            <h2 className="text-3xl text-white mb-2">
              {plan.title}
            </h2>
            <p className="text-2xl text-white mb-2">
              {plan.price}
            </p>
            <p className="text-white mb-4">{plan.details}</p>

            {/* 「問い合わせ」ボタン */}
            <Link
              href={plan.contactLink}
              className="
                mt-auto
                inline-block
                px-4
                py-2
                rounded
                bg-white
                text-black
                hover:bg-gray-200
                transition-colors
              "
            >
              お問い合わせ
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}