"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactGA from "react-ga4";

// 各セクションタイトル
const sectionTitles = ["経歴", "撮影歴", "所有機材", "Links"];

// ウィンドウ幅取得フック
function useWindowSize() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

// ---------------- 各セクションコンポーネント ----------------
function CareerSection() {
  const data = [
    ["2022/3", "広尾学園高等学校 医進・サイエンスコース 卒業"],
    ["2023/4", "iT4P studio 開業"],
    ["2023/6", "ニコンプロフェッショナルサービス（NPS） 入会"],
    ["2023/10", "乙種第4類危険物取扱者 合格"],
    ["2024/7", "応用情報技術者試験 合格"],
    ["2026/3", "筑波大学 情報学群 知識情報・図書館学類 卒業（見込み）"],
  ];
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-6">経歴</h2>
      <table className="mx-auto w-full max-w-2xl text-lg">
        <tbody>
          {data.map(([t, e], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="py-2 pr-4 text-left whitespace-nowrap">{t}</td>
              <td className="py-2 text-left">{e}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistorySection() {
  const groups = [
    { period: "バレーボール", items: ["SV.LEAGUE"] },
    {
      period: "マラソン",
      items: [
        "東京マラソン",
        "横浜マラソン",
        "福岡マラソン",
        "その他全国のマラソン・トレイルラン",
      ],
    },
    { period: "ロード", items: ["ツール・ド・東北", "おきなわKINトライアスロン大会"] },
    {
      period: "学校関係",
      items: [
        "全国中学校体育大会",
        "全国高等学校総合体育大会",
        "その他、イベントの公式記録、スクールなど",
      ],
    },
  ];
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-6">撮影歴</h2>
      <div className="mx-auto max-w-2xl">
        {groups.map((g, i) => (
          <div key={i} className="mb-8">
            <h3 className="text-2xl font-semibold mb-2 whitespace-nowrap">{g.period}</h3>
            <ul className="list-none space-y-1">
              {g.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function EquipmentSection() {
  const categories = [
    { category: "カメラ", items: ["Nikon Z9", "Nikon Z8", "Nikon Z6"] },
    {
      category: "レンズ",
      items: [
        "Z24-70mm f/4 S",
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
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-6">所有機材</h2>
      {categories.map((c, i) => (
        <div key={i} className="mb-6">
          <h3 className="text-2xl font-semibold mb-2 whitespace-nowrap">{c.category}</h3>
          <ul className="list-none space-y-1">
            {c.items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LinksSection() {
  const links = [
    { href: "https://xn--19ja1fb.xn--q9jyb4c/#home", icon: "/images/icons/ふわふわ.みんな.png" },
    { href: "https://iorin.io/", icon: "/images/icons/iorin.io.png" },
  ];
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-6">Links</h2>
      <div className="flex justify-center items-center gap-8">
        {links.map((l, i) => {
          const filename = l.icon.split('/').pop().replace(/\.[^/.]+$/, '');
          return (
            <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <Image src={l.icon} alt={filename} width={64} height={64} />
              <span className="mt-2 text-sm text-gray-300">{filename}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// デスクトップ版: セクション切り替え表示
function DesktopView() {
  const [index, setIndex] = useState(0);
  const wheelLock = useRef(false);

  const sections = [
    <CareerSection key="career" />,
    <HistorySection key="history" />,
    <EquipmentSection key="equipment" />,
    <LinksSection key="links" />,
  ];

  const goNext = useCallback(
    () => setIndex((i) => Math.min(i + 1, sections.length - 1)),
    [sections.length]
  );
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    ReactGA.initialize("G-GVJZVJ676G");
    ReactGA.send("pageview");
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (wheelLock.current) return;
      if (e.deltaY > 0) goNext(); else goPrev();
      wheelLock.current = true;
      setTimeout(() => { wheelLock.current = false; }, 800);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  return (
    <main className="relative bg-black text-white" style={{ height: "calc(100vh - 60px)" }}>
      <AnimatePresence mode="wait">
        <motion.section
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col items-center justify-center w-full">
            {sections[index]}
          </div>
        </motion.section>
      </AnimatePresence>

      <nav className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-end space-y-4">
        {sectionTitles.map((t, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="flex items-center focus:outline-none"
          >
            {index === i ? (
              <motion.span
                className="text-white mr-2"
                animate={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                {t}
              </motion.span>
            ) : (
              <span className="text-gray-400 mr-2">{t}</span>
            )}
            <span
              className={`w-3 h-12 border border-white block ${index === i ? "bg-white" : "bg-black"}`}
            />
          </button>
        ))}
      </nav>
    </main>
  );
}

// モバイル版: 全セクション縦並び
function MobileView() {
  return (
    <main className="bg-black text-white">
      <section className="py-8 px-4"><CareerSection /></section>
      <section className="py-8 px-4"><HistorySection /></section>
      <section className="py-8 px-4"><EquipmentSection /></section>
      <section className="py-8 px-4"><LinksSection /></section>
    </main>
  );
}

// エントリーポイント
export default function AboutPage() {
  const width = useWindowSize();
  const isSP = width > 0 && width < 640;
  return isSP ? <MobileView /> : <DesktopView />;
}
