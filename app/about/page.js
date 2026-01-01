"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import ReactGA from "react-ga4";

const sectionTitles = ["経歴", "撮影歴", "所有機材", "Links"];

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
  {
    period: "陸上競技",
    items: [
      "東京2025世界陸上",
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

const equipmentCategories = [
  { category: "カメラ", items: ["Nikon Z9", "Nikon Z8", "Nikon Z6"] },
  {
    category: "レンズ",
    items: [
      "Z 24-70mm f/4 S",
      "Z 70-200mm f/2.8 VR S",
      "Z 50mm f/1.2 S",
      "Z 26mm f/2.8",
      "Z TELECONVERTER TC-2.0x",
      "AF-S Fisheye 8-15/3.5-4.5E",
    ],
  },
  { category: "自動車", items: ["GR86"] },
];

const links = [
  { href: "https://xn--19ja1fb.xn--q9jyb4c/#home", icon: "/images/icons/ふわふわ.みんな.png" },
  { href: "https://iorin.io/", icon: "/images/icons/iorin.io.png" },
];

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

const createVariants = (reduceMotion) => {
  const baseEase = [0.16, 1, 0.3, 1];
  return {
    section: {
      initial: {
        opacity: 0,
        y: reduceMotion ? 0 : 28,
        filter: reduceMotion ? "blur(0px)" : "blur(8px)",
      },
      animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: reduceMotion ? 0 : 0.7, ease: baseEase },
      },
      exit: {
        opacity: 0,
        y: reduceMotion ? 0 : -24,
        filter: reduceMotion ? "blur(0px)" : "blur(8px)",
        transition: { duration: reduceMotion ? 0 : 0.5, ease: baseEase },
      },
    },
    title: {
      initial: { opacity: 0, y: reduceMotion ? 0 : 12 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.05 },
      },
    },
    rule: {
      initial: { scaleX: 0 },
      animate: {
        scaleX: 1,
        transition: { duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.1 },
      },
    },
    list: {
      animate: {
        transition: { staggerChildren: reduceMotion ? 0 : 0.06, delayChildren: reduceMotion ? 0 : 0.12 },
      },
    },
    item: {
      initial: { opacity: 0, y: reduceMotion ? 0 : 12 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.4, ease: baseEase },
      },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.4 } },
    },
  };
};

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <motion.div
        className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function SectionShell({ index, title, variants, children }) {
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <motion.span variants={variants.fade} className="text-[11px] tracking-[0.45em] text-gray-500">
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <motion.h2 variants={variants.title} className="text-3xl font-semibold md:text-4xl">
            {title}
          </motion.h2>
        </div>
        <motion.div variants={variants.rule} className="mt-4 h-px w-24 origin-left bg-white/40" />
      </div>
      {children}
    </div>
  );
}

function CareerSection({ variants }) {
  return (
    <div className="relative pl-5">
      <div className="absolute left-1 top-2 h-[calc(100%-8px)] w-px bg-white/10" />
      <motion.ul variants={variants.list} className="space-y-4">
        {careerData.map(([t, e], i) => (
          <motion.li key={i} variants={variants.item} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
            <span className="text-xs tracking-[0.2em] text-gray-400 md:w-24">{t}</span>
            <span className="text-base text-gray-100">{e}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function HistorySection({ variants }) {
  return (
    <motion.div variants={variants.list} className="flex flex-col">
      {historyGroups.map((group, i) => (
        <motion.div
          key={i}
          variants={variants.item}
          className="border-b border-white/10 py-4 last:border-b-0 last:pb-0"
        >
          <div className="text-xs tracking-[0.35em] text-gray-400">{group.period}</div>
          <ul className="mt-3 space-y-1 text-sm text-gray-100 md:text-base">
            {group.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}

function EquipmentSection({ variants }) {
  return (
    <motion.div variants={variants.list} className="space-y-6">
      {equipmentCategories.map((category, i) => (
        <motion.div key={i} variants={variants.item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-xs tracking-[0.35em] text-gray-400">{category.category}</div>
          <ul className="mt-3 grid gap-1 text-sm text-gray-100 md:text-base">
            {category.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}

function LinksSection({ variants }) {
  return (
    <motion.div variants={variants.list} className="flex flex-wrap justify-center gap-8">
      {links.map((link, i) => {
        const filename = link.icon.split("/").pop().replace(/\.[^/.]+$/, "");
        return (
          <motion.a
            key={i}
            variants={variants.item}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/10">
              <Image src={link.icon} alt={filename} width={48} height={48} />
            </div>
            <span className="text-xs tracking-[0.2em] text-gray-300">{filename}</span>
          </motion.a>
        );
      })}
    </motion.div>
  );
}

function DesktopView() {
  const [index, setIndex] = useState(0);
  const wheelLock = useRef(false);
  const reduceMotion = useReducedMotion();
  const variants = useMemo(() => createVariants(reduceMotion), [reduceMotion]);

  const sections = useMemo(
    () => [
      { key: "career", title: "経歴", content: <CareerSection variants={variants} /> },
      { key: "history", title: "撮影歴", content: <HistorySection variants={variants} /> },
      { key: "equipment", title: "所有機材", content: <EquipmentSection variants={variants} /> },
      { key: "links", title: "Links", content: <LinksSection variants={variants} /> },
    ],
    [variants]
  );

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
      setTimeout(() => { wheelLock.current = false; }, 900);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  return (
    <main className="relative min-h-[calc(100vh-60px)] bg-black text-white">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex h-[calc(100vh-60px)] max-w-6xl items-center px-6">
        <AnimatePresence mode="wait">
          <motion.section
            key={sections[index].key}
            className="relative w-full"
            variants={variants.section}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SectionShell index={index} title={sections[index].title} variants={variants}>
              {sections[index].content}
            </SectionShell>
          </motion.section>
        </AnimatePresence>
      </div>

      <nav className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-6">
        {sectionTitles.map((title, i) => {
          const active = index === i;
          return (
            <button
              key={title}
              onClick={() => setIndex(i)}
              className="group flex items-center gap-4 text-left"
            >
              <span className={`text-[11px] tracking-[0.4em] ${active ? "text-white" : "text-gray-600"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm transition-colors ${active ? "text-white" : "text-gray-400"}`}>
                {title}
              </span>
              <span className="relative h-12 w-[2px] bg-white/10">
                {active && (
                  <motion.span
                    layoutId="about-nav"
                    className="absolute inset-0 bg-white"
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}

function MobileView() {
  const reduceMotion = useReducedMotion();
  const variants = useMemo(() => createVariants(reduceMotion), [reduceMotion]);
  const sections = [
    { key: "career", title: "経歴", content: <CareerSection variants={variants} /> },
    { key: "history", title: "撮影歴", content: <HistorySection variants={variants} /> },
    { key: "equipment", title: "所有機材", content: <EquipmentSection variants={variants} /> },
    { key: "links", title: "Links", content: <LinksSection variants={variants} /> },
  ];

  return (
    <main className="relative bg-black text-white">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-12 px-6 py-10">
        {sections.map((section, index) => (
          <motion.section
            key={section.key}
            variants={variants.section}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.35 }}
          >
            <SectionShell index={index} title={section.title} variants={variants}>
              {section.content}
            </SectionShell>
          </motion.section>
        ))}
      </div>
    </main>
  );
}

export default function AboutPage() {
  const width = useWindowSize();
  const isSP = width > 0 && width < 640;
  return isSP ? <MobileView /> : <DesktopView />;
}
