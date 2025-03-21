"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const TOTAL_SECTIONS = 4;
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

      if (e.deltaY > 0) {
        goNext();
      } else if (e.deltaY < 0) {
        goPrev();
      }
      setWheelLock(true);
      setTimeout(() => {
        setWheelLock(false);
      }, 1000);
    };

    window.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheelEvent);
    };
  }, [wheelLock, goNext, goPrev]);

  const sections = [
    <CareerSection key="career" />,
    <HistorySection key="history" />,
    <EquipmentSection key="equip" />, // 中央揃え
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

      {/* 右側インジケータ */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4 items-center">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`
              w-3 h-12 border border-white cursor-pointer
              ${sectionIndex === idx ? "bg-white" : "bg-black"}
            `}
            onClick={() => setSectionIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}

// ====== 各セクション ======

function CareerSection() {
  const careerData = [
    ["2022/3", "広尾学園高等学校 医進・サイエンスコース 卒業"],
    ["2023/4", "iT4P studio 開業"],
    ["2026/3", "筑波大学 情報学群 知識情報・図書館学類 卒業（見込み）"],
  ];
  return (
    <div className="p-4">
      {/* 見出しのみ中央 */}
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
  // 所有機材だけ全体を中央揃え
  const categories = [
    { category: "カメラ", items: ["Nikon Z9", "Nikon Z8"] },
    { category: "レンズ", items: ["Z24-70mm F4", "Z70-200mm F2.8/S", "Z50mm f1.2/S"] },
  ];
  return (
    <div className="p-4 text-center">
      <h2 className="text-4xl font-bold mb-6">所有機材</h2>
      {/* カテゴリやアイテムもすべて中央 */}
      {categories.map((cat, i) => (
        <div key={i} className="mb-6 text-lg">
          <h4 className="text-xl font-semibold mb-1 whitespace-nowrap">
            {cat.category}
          </h4>
          {cat.items.map((item, j) => (
            <p key={j} className="whitespace-nowrap">{item}</p>
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
            <Image
              src={lk.icon}
              alt={lk.alt}
              width={64}
              height={64}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
