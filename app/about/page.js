"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ReactGA from "react-ga4";

// セクションタイトル
const sectionTitles = ["経歴", "撮影歴", "所有機材", "Links"];

// データ定義
const careerData = [
  ["2022/3", "広尾学園高等学校 医進・サイエンスコース 卒業"],
  ["2023/4", "iT4P studio 開業"],
  ["2023/6", "ニコンプロフェッショナルサービス（NPS） 入会"],
  ["2023/10", "乙種第4類危険物取扱者 合格"],
  ["2024/7", "応用情報技術者試験 合格"],
  ["2026/3", "筑波大学 情報学群 知識情報・図書館学類 卒業（見込み）"],
];
const historyGroups = [
  { period: "バレーボール", items: ["SV.LEAGUE"] },
  { period: "マラソン", items: [
      "東京マラソン", "横浜マラソン", "福岡マラソン", "その他全国のマラソン・トレイルラン"
    ]
  },
  { period: "ロード", items: ["ツール・ド・東北", "おきなわKINトライアスロン大会"] },
  { period: "学校関係", items: [
      "全国中学校体育大会", "全国高等学校総合体育大会", "その他、イベントの公式記録、スクールなど"
    ]
  }
];
const equipmentCategories = [
  { category: "カメラ", items: ["Nikon Z9", "Nikon Z8", "Nikon Z6"] },
  { category: "レンズ", items: ["Z24-70mm F4", "Z70-200mm F2.8/S", "Z50mm f1.2/S"] },
  { category: "自動車", items: ["GR86"] },
];
const iconLinks = [
  { href: "https://xn--19ja1fb.xn--q9jyb4c/#home", icon: "/images/icons/friend1.png", alt: "Friend1" },
  { href: "https://iorin.io/", icon: "/images/icons/friend2.png", alt: "Friend2" },
];

// ウィンドウ幅取得フック
function useWindowSize() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

// メインコンポーネント
export default function AboutPage() {
  const width = useWindowSize();
  const isSP = width > 0 && width < 640;

  // Google Analytics
  useEffect(() => {
    ReactGA.initialize("G-GVJZVJ676G");
    ReactGA.send("pageview");
  }, []);

  return isSP ? <MobileView /> : <DesktopView />;
}

// モバイル版: 縦積み
function MobileView() {
  return (
    <main className="bg-black text-white font-serif">
      <section className="py-8 px-4"><CareerSection /></section>
      <section className="py-8 px-4"><HistorySection /></section>
      <section className="py-8 px-4"><EquipmentSection /></section>
      <section className="py-8 px-4"><LinksSection /></section>
    </main>
  );
}
// デスクトップ版: スライド切替
function DesktopView() {
  const [index, setIndex] = useState(0);
  const wheelLock = useRef(false);
  const touchY = useRef(0);
  const total = sectionTitles.length;

  const goNext = useCallback(() => setIndex(i => Math.min(i + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);

  // ホイールイベント
  useEffect(() => {
    const onWheel = e => {
      e.preventDefault();
      if (wheelLock.current) return;
      e.deltaY > 0 ? goNext() : goPrev();
      wheelLock.current = true;
      setTimeout(() => (wheelLock.current = false), 1000);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  // タッチ操作
  const handleStart = e => (touchY.current = e.touches[0].clientY);
  const handleMove = e => {
    const delta = touchY.current - e.touches[0].clientY;
    if (Math.abs(delta) < 50 || wheelLock.current) return;
    delta > 0 ? goNext() : goPrev();
    wheelLock.current = true;
    setTimeout(() => (wheelLock.current = false), 1000);
  };

  return (
    <main
      className="relative bg-black text-white w-screen overflow-hidden"
      style={{ height: "calc(100vh - 60px)", fontFamily: "serif" }}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {{
            0: <CareerSection />,
            1: <HistorySection />,
            2: <EquipmentSection />,
            3: <LinksSection />
          }[index]}
        </motion.div>
      </AnimatePresence>
      <nav className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col space-y-4 items-end">
        {sectionTitles.map((t, i) => (
          <button
            key={i}
            className="flex items-center focus:outline-none"
            onClick={() => setIndex(i)}
          >
            <span className={index === i ? "mr-2 text-white" : "mr-2 text-gray-400"}>
              {t}
            </span>
            <span
              className={`w-3 h-12 border border-white ${index === i ? "bg-white" : "bg-black"}`}
            />
          </button>
        ))}
      </nav>
    </main>
  );
}

// セクションコンポーネント定義
function CareerSection() {
  return (
    <div>
      <h2 className="text-4xl font-bold my-6 text-center">経歴</h2>
      <table className="mx-auto w-full max-w-2xl text-lg">
        <tbody>
          {careerData.map(([time, txt], idx) => (
            <tr key={idx} className="border-b border-gray-600">
              <td className="py-2 pr-4 text-left">{time}</td>
              <td className="py-2 text-left">{txt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistorySection() {
  return (
    <div>
      <h2 className="text-4xl font-bold text-center mt-6">撮影歴</h2>
      <table className="mx-auto w-full max-w-2xl text-lg">
        <tbody>
          {historyGroups.map((grp, gi) => (
            <React.Fragment key={gi}>
              <tr>
                <td colSpan={2} className="pt-6 pb-4 text-2xl font-semibold text-center">{grp.period}</td>
              </tr>
              {grp.items.map((it, ii) => (
                <tr key={ii} className="border-none">
                  <td className="text-lg text-center">{it}</td>
                  <td className="text-lg text-left" />
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquipmentSection() {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-6 text-center">所有機材</h2>
      {equipmentCategories.map((cat, ci) => (
        <div key={ci} className="mb-6 text-lg text-center">
          <h4 className="text-2xl font-semibold mb-2 whitespace-nowrap">{cat.category}</h4>
          {cat.items.map((it, ii) => <p key={ii} className="whitespace-nowrap">{it}</p>)}
        </div>
      ))}
    </div>
  );
}

function LinksSection() {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-6 text-center">Links</h2>
      <div className="flex gap-8 justify-center items-center">
        {iconLinks.map((lk, li) => (
          <a key={li} href={lk.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
            <Image src={lk.icon} alt={lk.alt} width={64} height={64} />
          </a>
        ))}
      </div>
    </div>
  );
}
