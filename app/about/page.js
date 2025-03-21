"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  // 4セクション: 0=経歴, 1=撮影歴, 2=所有機材, 3=Links
  const [sectionIndex, setSectionIndex] = useState(0);
  const TOTAL_SECTIONS = 4;

  // 1回のスクロールあたり1セクションのみ移動するロック
  const [wheelLock, setWheelLock] = useState(false);

  const goNext = useCallback(() => {
    setSectionIndex((prev) => (prev < TOTAL_SECTIONS - 1 ? prev + 1 : prev));
  }, []);
  const goPrev = useCallback(() => {
    setSectionIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const handleWheelEvent = (e) => {
      e.preventDefault();
      if (wheelLock) return;

      // 下方向( deltaY>0 ) => 次へ
      if (e.deltaY > 0) {
        goNext();
      } 
      // 上方向( deltaY<0 ) => 前へ
      else if (e.deltaY < 0) {
        goPrev();
      }
      setWheelLock(true);
      // 1秒後にロック解除
      setTimeout(() => {
        setWheelLock(false);
      }, 1000);
    };

    window.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [wheelLock, goNext, goPrev]);

  // 4つのセクションを配列化
  const sections = [
    <CareerSection key="career" />,
    <HistorySection key="history" />,
    <EquipmentSection key="equip" />,
    <LinksSection key="links" />,
  ];

  return (
    <div
      className="relative bg-black text-white"
      style={{
        width: "100vw",
        height: "calc(100vh - 60px)",
        marginTop: "60px",
        overflow: "hidden",
        // このページだけ明朝体で統一
        fontFamily: "serif",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={sectionIndex}
          className="absolute inset-0 flex items-start justify-center pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {sections[sectionIndex]}
        </motion.div>
      </AnimatePresence>

      {/* 右側: タイトル + 四角形を縦に並べる */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4 items-end">
        {/* タイトル配列とセクションidxを揃える */}
        {["経歴", "撮影歴", "所有機材", "Links"].map((title, idx) => {
          const isActive = sectionIndex === idx;
          return (
            <div
              key={idx}
              className="flex items-center cursor-pointer"
              onClick={() => setSectionIndex(idx)}
            >
              {/* タイトル部分: 非アクティブはグレー, アクティブは白 */}
              <span
                className={
                  isActive
                    ? "mr-2 text-white"
                    : "mr-2 text-gray-400"
                }
              >
                {title}
              </span>

              {/* 四角形 */}
              <div
                className={`w-3 h-12 border border-white ${
                  isActive ? "bg-white" : "bg-black"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------- 各セクション -------------------

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
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-center">経歴</h2>
      <table className="mx-auto w-[600px] text-lg">
        <tbody>
          {careerData.map(([time, event], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="py-2 pr-4 whitespace-nowrap text-left">{time}</td>
              <td className="py-2 whitespace-nowrap text-left">{event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistorySection() {
  const historyData = [
    ["東京マラソン", "2023〜25"],
    ["S.V.League", "2024〜"],
    ["スポーツ撮影・配信", ""],
    ["イベント撮影・配信", ""],
    ["スクール撮影・配信", ""],
  ];
  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-center">撮影歴</h2>
      <table className="mx-auto w-[600px] text-lg">
        <tbody>
          {historyData.map(([subject, period], i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="py-2 pr-4 whitespace-nowrap text-left">{subject}</td>
              <td className="py-2 whitespace-nowrap text-left">{period}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquipmentSection() {
  const categories = [
    { category: "カメラ", items: ["Nikon Z9", "Nikon Z8", "Nikon Z6"] },
    {
      category: "レンズ",
      items: ["Z24-70mm F4", "Z70-200mm F2.8/S", "Z50mm f1.2/S", "Z 26/2.8", "Z テレコンバーター TC-2.0x", "AF-S FI 8-15/3.5-4.5E"],
    },
    { category: "自動車", items: ["GR86"] },
  ];
  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-center">所有機材</h2>
      {categories.map((cat, i) => (
        <div key={i} className="mb-6 text-lg">
          <h4 className="text-2xl font-semibold mb-2 whitespace-nowrap text-center">
            {cat.category}
          </h4>
          {cat.items.map((item, j) => (
            <p key={j} className="whitespace-nowrap text-center">{item}</p>
          ))}
        </div>
      ))}
    </div>
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
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-6 text-center">Links</h2>
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
    </div>
  );
}
