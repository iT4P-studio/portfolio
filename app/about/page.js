"use client";

import Image from "next/image";
import React from "react";

/**
 * このページの構造:
 *  - 親div: relative, total height = 400vh 分
 *    - 左カラム: sticky (top: 0), 高さ100vh
 *    - 右カラム: (経歴/撮影歴/所有機材) 各100vh × 3 = 300vh
 *    - その下に 2段目 (SNSアイコンなど) 100vh
 */
export default function AboutPage() {
  // 2段目アイコン例
  const friendLinks = [
    {
      href: "https://friend1-site.example.com",
      icon: "/images/icons/friend1.png",
      alt: "Friend1",
    },
    {
      href: "https://twitter.com/friend2",
      icon: "/images/icons/friend2.png",
      alt: "Friend2 Twitter",
    },
    // さらに追加
  ];

  return (
    <div className="w-full relative">
      {/* 親ラッパ: height=400vh 分スクロールできる */}
      <div className="relative w-full h-[400vh]">

        {/* 左写真 (sticky) */}
        <div className="sticky top-0 w-1/2 h-screen float-left overflow-hidden">
          {/* 写真: public/images/me.jpg に配置しておく */}
          <Image
            src="/images/me.jpg"
            alt="Me"
            fill
            className="object-cover"
          />
        </div>

        {/* 右カラム: 3つのセクション + 2段目(アイコン) */}
        <div className="float-left w-1/2 bg-neutral-900">
          {/* 1. 経歴 */}
          <section className="h-screen flex items-center justify-center">
            <CareerSection />
          </section>

          {/* 2. 撮影歴 */}
          <section className="h-screen flex items-center justify-center">
            <HistorySection />
          </section>

          {/* 3. 所有機材 */}
          <section className="h-screen flex items-center justify-center">
            <EquipmentSection />
          </section>

          {/* 2段目: SNSリンク等 */}
          <section className="h-screen flex flex-col items-center justify-center bg-black">
            <h2 className="mb-8 text-xl font-bold">Friends / SNS</h2>
            <div className="flex space-x-6">
              {friendLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src={link.icon}
                    alt={link.alt}
                    width={64}
                    height={64}
                    className="hover:opacity-70 transition"
                  />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/** 経歴 (テーブル例) */
function CareerSection() {
  const careerData = [
    ["2020年4月", "○○大学 入学"],
    ["2023年3月", "○○大学 卒業"],
    ["2023年4月", "フリーランスとして活動開始"],
  ];
  return (
    <div className="text-white p-4 w-[300px]">
      <h3 className="text-2xl font-bold mb-4">経歴</h3>
      <table className="w-full">
        <tbody>
          {careerData.map(([time, event], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="pr-4 py-2 text-sm">{time}</td>
              <td className="py-2 text-sm">{event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 撮影歴 (テーブル例) */
function HistorySection() {
  const historyData = [
    ["スポーツ写真", "3年"],
    ["舞台・ステージ撮影", "2年"],
    ["イベント撮影", "1年"],
  ];
  return (
    <div className="text-white p-4 w-[300px]">
      <h3 className="text-2xl font-bold mb-4">撮影歴</h3>
      <table className="w-full">
        <tbody>
          {historyData.map(([subject, period], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="pr-4 py-2 text-sm">{subject}</td>
              <td className="py-2 text-sm">{period}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 所有機材 */
function EquipmentSection() {
  // 所有機材をカテゴリ分け
  const categories = [
    {
      category: "カメラ",
      items: ["Canon EOS R5", "Sony α7IV"],
    },
    {
      category: "レンズ",
      items: ["EF 24-70mm F2.8", "EF 70-200mm F2.8"],
    },
  ];

  return (
    <div className="text-white p-4 w-[300px]">
      <h3 className="text-2xl font-bold mb-4">所有機材</h3>
      {categories.map((cat, i) => (
        <div key={i} className="mb-4">
          <h4 className="text-lg font-semibold mb-1">{cat.category}</h4>
          {cat.items.map((item, j) => (
            <p key={j} className="ml-4 text-sm">{item}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
