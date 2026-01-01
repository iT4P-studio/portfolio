"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const plans = [
  {
    title: "写真撮影",
    price: "¥20,000〜/day",
    details: "スポーツ・イベント・ステージ撮影",
    contactLink: "/contact",
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
];

const createVariants = (reduceMotion) => {
  const baseEase = [0.16, 1, 0.3, 1];
  return {
    container: {
      animate: {
        transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.1 },
      },
    },
    item: {
      initial: { opacity: 0, y: reduceMotion ? 0 : 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase },
      },
    },
    title: {
      initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase },
      },
    },
    rule: {
      initial: { scaleX: 0 },
      animate: {
        scaleX: 1,
        transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase, delay: reduceMotion ? 0 : 0.1 },
      },
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

export default function PriceClient() {
  const reduceMotion = useReducedMotion();
  const variants = useMemo(() => createVariants(reduceMotion), [reduceMotion]);

  return (
    <main className="relative min-h-[calc(100vh-60px)] bg-black text-white">
      <AmbientBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        <motion.div variants={variants.container} initial="initial" animate="animate">
          <motion.div variants={variants.title} className="mb-10 max-w-2xl">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="text-[11px] tracking-[0.45em]">PRICE</span>
              <motion.span variants={variants.rule} className="h-px w-16 origin-left bg-white/40" />
            </div>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Price</h1>
            <p className="mt-4 text-sm text-gray-300 md:text-base">
              料金は撮影内容等によって大きく変動することがございます。ぜひ一度、お気軽にお問い合わせください。
            </p>
          </motion.div>

          <motion.div
            variants={variants.container}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                variants={variants.item}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/10 p-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
              >
                <div className="text-xs tracking-[0.35em] text-gray-500">PLAN</div>
                <h2 className="mt-3 text-2xl font-semibold text-white">{plan.title}</h2>
                <p className="mt-2 text-xl text-white">{plan.price}</p>
                <p className="mt-4 text-sm text-gray-300">{plan.details}</p>
                <div className="mt-auto pt-6">
                  <Link
                    href={plan.contactLink}
                    className="inline-flex items-center gap-3 self-start rounded-full border border-white/30 px-5 py-2 text-sm tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    お問い合わせ
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
