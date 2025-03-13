"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion"; 
// フェードアニメーション用にフレームワークを導入（任意）
// npm install framer-motion

export default function AboutPage() {
  // 右側区画に表示するタブ（経歴／撮影歴／所有機材）
  const sections = ["経歴", "撮影歴", "所有機材"];

  // どのセクションを表示中か (0=経歴, 1=撮影歴, 2=所有機材)
  const [activeIndex, setActiveIndex] = useState(0);

  // スクロール量に応じて、上から順にアクティブセクションを切り替える
  // 今回は簡単に「3等分したスクロール位置」を基準にする例を示します。
  // もし高度なカスタマイズが必要であれば Intersection Observerなどで細かく制御してください。
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // 0 ~ 1 の範囲を 3等分
      if (latest < 1 / 3) {
        setActiveIndex(0);
      } else if (latest < 2 / 3) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 2段目アイコンたち
  const friendLinks = [
    {
      href: "https://friend1-portfolio.example.com/",
      icon: "/images/icons/friend1.png",
      alt: "https://xn--19ja1fb.xn--q9jyb4c/#home",
    },
    {
      href: "https://twitter.com/friend2",
      icon: "/images/icons/friend2.png",
      alt: "Friend2 Twitter",
    },
    // ... さらに追加
  ];

  return (
    <div className="w-full">
      {/* 1段目: Stickyレイアウト */}
      <section className="relative w-full h-[300vh]">
        {/* 
          左写真: スクロールしても固定 (sticky)
          高さ100vhを維持して常に左側いっぱいに表示 
        */}
        <div className="absolute inset-0 flex">
          <div className="sticky top-0 w-1/2 h-screen overflow-hidden">
            <Image
              src="/images/me.jpg"
              alt="My Photo"
              fill
              className="object-cover"
            />
          </div>

          {/* 右側: 3区画をフェード切り替え */}
          <div className="w-1/2 min-h-[300vh] bg-neutral-900 flex flex-col">
            {/* 各セクションのフェード切り替え */}
            <div className="h-screen flex items-center justify-center">
              <motion.div
                key={sections[0]}
                initial={{ opacity: activeIndex === 0 ? 1 : 0 }}
                animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute"
              >
                <SectionCareer />
              </motion.div>

              <motion.div
                key={sections[1]}
                initial={{ opacity: activeIndex === 1 ? 1 : 0 }}
                animate={{ opacity: activeIndex === 1 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute"
              >
                <SectionHistory />
              </motion.div>

              <motion.div
                key={sections[2]}
                initial={{ opacity: activeIndex === 2 ? 1 : 0 }}
                animate={{ opacity: activeIndex === 2 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute"
              >
                <SectionEquipments />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2段目: SNS/友人リンクアイコン */}
      <section className="w-full h-screen bg-black flex flex-col items-center justify-center">
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
  );
}

/** 経歴セクション */
function SectionCareer() {
  // テーブル例: [年月, 出来事]
  const careerData = [
    ["2020年4月", "〇〇大学 入学"],
    ["2023年3月", "〇〇大学 卒業"],
    ["2023年4月", "フリーランスとして活動開始"],
  ];
  return (
    <div className="text-white p-4 w-[300px]">
      <h3 className="text-2xl font-bold mb-4">経歴</h3>
      <table className="w-full">
        <tbody>
          {careerData.map(([time, event], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="pr-4 py-2 text-sm whitespace-nowrap">{time}</td>
              <td className="py-2 text-sm">{event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 撮影歴セクション */
function SectionHistory() {
  // テーブル例: [撮影対象, 年数など]
  const historyData = [
    ["スポーツ写真", "3年"],
    ["舞台・ステージ撮影", "2年"],
    ["イベント・ブライダル", "1年"],
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

/** 所有機材セクション */
function SectionEquipments() {
  // カテゴリごとの機材例
  const categories = [
    {
      category: "カメラ",
      items: ["Canon EOS R5", "Sony α7IV"],
    },
    {
      category: "レンズ",
      items: ["EF 24-70mm F2.8", "EF 70-200mm F2.8"],
    },
    {
      category: "照明 / 音声",
      items: ["Godox LEDライト", "Wireless Mic System"],
    },
  ];

  return (
    <div className="text-white p-4 w-[300px]">
      <h3 className="text-2xl font-bold mb-4">所有機材</h3>
      {categories.map((cat, i) => (
        <div key={i} className="mb-4">
          <h4 className="text-lg font-semibold mb-1">{cat.category}</h4>
          {cat.items.map((item, j) => (
            <p key={j} className="ml-4 text-sm list-disc list-inside">
              {item}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
