"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactGA from "react-ga4";

// セクションタイトルを定義
const sectionTitles = ["経歴", "撮影歴", "所有機材", "Links"];
// セクションコンポーネントの配列（キー付き）
const sections = [
  <CareerSection key="career" />,
  <HistorySection key="history" />,
  <EquipmentSection key="equipment" />,
  <LinksSection key="links" />,
];

const historyGroups = [
  {
    period: "バレーボール",
    items: [
      "SV.LEAGUE",
    ],
  },
  {
    period: "マラソン",
    items: [
      "東京マラソン",
      "横浜マラソン",
      "福岡マラソン",
      "その他全国のマラソン・トレイルラン",
    ],
  },
  {
    period: "ロード",
    items: [
      "ツール・ド・東北",
      "おきなわKINトライアスロン大会",
    ],
  },
  {
    period: "学校関係",
    items: [
      "全国中学校体育大会",
      "全国高等学校総合体育大会",
      "その他、イベントの公式記録、スクールなど",
    ],
  },
];

function useWindowSize() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 初回およびリサイズ時にウィンドウ幅をセット
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // マウント時に一度呼ぶ
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function AboutPage() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const wheelLock = useRef(false);

  const width = useWindowSize();
  const isSP = width > 0 && width < 640;

  const goNext = useCallback(() => {
    setSectionIndex((prev) => Math.min(prev + 1, sectionTitles.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setSectionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    ReactGA.initialize("G-GVJZVJ676G");
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (wheelLock.current) return;
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
      wheelLock.current = true;
      setTimeout(() => {
        wheelLock.current = false;
      }, 1000);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  return (
    <main
      className="relative bg-black text-white w-screen overflow-hidden"
      style={{ height: "calc(100vh - 60px)", fontFamily: "serif" }}
    >
      <AnimatePresence mode="wait">
        <motion.section
          key={sectionIndex}
          className="absolute inset-0 flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {sections[sectionIndex]}
        </motion.section>
      </AnimatePresence>

      <nav
        aria-label="セクションナビゲーション"
        className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col space-y-4 items-end"
      >
        {sectionTitles.map((title, idx) => {
          const isActive = sectionIndex === idx;
          return (
            <button
              key={idx}
              className="flex items-center focus:outline-none"
              onClick={() => setSectionIndex(idx)}
              aria-current={isActive ? "true" : undefined}
            >
              {!isSP && (
                <span
                  className={
                    isActive ? "mr-2 text-white" : "mr-2 text-gray-400"
                  }
                >
                  {title}
                </span>
              )}
              <span
                className={`w-3 h-12 border border-white block ${
                  isActive ? "bg-white" : "bg-black"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </main>
  );
}

// ------------------- 各セクションコンポーネント -------------------

function CareerSection() {
  const careerData = [
    ["2022/3", "広尾学園高等学校 医進・サイエンスコース 卒業"],
    ["2023/4", "iT4P studio 開業"],
    ["2023/6", "ニコンプロフェッショナルサービス（NPS） 入会"],
    ["2023/10", "乙種第4類危険物取扱者 合格"],
    ["2024/7", "応用情報技術者試験 合格"],
    ["2026/3", "筑波大学 情報学群 知識情報・図書館学類 卒業（見込み）"],
  ];

  return (
    <section className="p-4">
      <h2 className="text-4xl font-bold my-6 text-center">経歴</h2>
      <table className="mx-auto w-full max-w-2xl text-lg">
        <tbody>
          {careerData.map(([time, event], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="py-2 pr-4 text-left">{time}</td>
              <td className="py-2 text-left">{event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function HistorySection() {
  return (
    <section className="p-4">
      <h2 className="text-[20px] sm:text-[36px] font-bold text-center my-6">
        撮影歴
      </h2>
      <table className="mx-auto w-full max-w-2xl text-[14px] sm:text-[18px]">
        <tbody>
          {historyGroups.map((group) => (
            <React.Fragment key={group.period}>
              <tr>
                <td
                  colSpan={2}
                  className="pt-4 text-[16px] sm:text-[24px] font-semibold text-center"
                >
                  {group.period}
                </td>
              </tr>
              {group.items.map((subject, i) => (
                <tr key={i} className="border-none">
                  <td className=" text-[8px] sm:text-[20px] text-center">
                    {subject}
                  </td>
                  <td className="text-[8px] sm:text-[12px] text-left ">
                    {/* 空欄 */}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function EquipmentSection() {
  const categories = [
    { category: "カメラ", items: ["Nikon Z9", "Nikon Z8", "Nikon Z6"] },
    {
      category: "レンズ",
      items: [
        "Z24-70mm F4",
        "Z70-200mm F2.8/S",
        "Z50mm f1.2/S",
        "Z26/2.8",
        "Z テレコンバーター TC-2.0x",
        "AF-S Fisheye 8-15/3.5-4.5E",
      ],
    },
    { category: "自動車", items: ["GR86"] },
  ];

  return (
    <section className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-center my-6">所有機材</h2>
      {categories.map((cat, i) => (
        <div key={i} className="mb-6 text-lg">
          <h4 className="text-2xl font-semibold mb-2 whitespace-nowrap text-center">
            {cat.category}
          </h4>
          {cat.items.map((item, j) => (
            <p key={j} className="whitespace-nowrap text-center">
              {item}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}

function LinksSection() {
  const iconLinks = [
    {
      href: "https://xn--19ja1fb.xn--q9jyb4c/#home",
      icon: "/images/icons/friend1.png",
      alt: "Friend1",
    },
    {
      href: "https://iorin.io/",
      icon: "/images/icons/friend2.png",
      alt: "Friend2",
    },
  ];

  return (
    <section className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-center my-6">Links</h2>
      <div className="flex gap-8 justify-center items-center">
        {iconLinks.map((lk, i) => (
          <a
            key={i}
            href={lk.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <Image src={lk.icon} alt={lk.alt} width={64} height={64} />
          </a>
        ))}
      </div>
    </section>
  );
}
