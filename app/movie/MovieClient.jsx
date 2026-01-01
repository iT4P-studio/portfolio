"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * MovieWorksページ
 * - 一覧は区切り線で分ける
 * - 余裕がある場合は2段組で表示
 * - 日付を「タイトルの上」に表示 (小文字)
 * - タイトルは1行に収める (whitespace-nowrap)
 */

export default function MovieClient() {
  const featured = {
    date: "2025/06/11",
    title: "UNIKP 2025 Vol.12 関東予選",
    embedUrl: "https://player.vimeo.com/video/1092752130?h=d5733889f3&title=0&byline=0&portrait=0",
    caption: "2025/6/11に行われた「UNIKP 2025 Vol.12 関東予選」のダイジェスト映像です。撮影と編集を担当しています。",
  };

  // タイトル + 日付 + 埋め込み(動画/画像) + caption
  const items = [
    {
      date: "2025/03/19",
      title: "ダンス公演 収録",
      type: "image",
      embedUrl: "/images/mw/mw2.JPG", 
      caption: "ディレクション・撮影・SW・編集を担当"
    },
    {
      date: "2025/02",
      title: "医療関連施設 紹介動画制作",
      type: "image",
      embedUrl: "/images/mw/mw1.JPG", 
      caption: "構成・撮影・音響・編集を担当"
    },
    {
      date: "2024/09/14",
      title: "アカペラ公演 配信・収録",
      type: "image",
      embedUrl: "/images/mw/mw3.JPG", 
      caption: "ディレクション・撮影・SW・配信管理を担当"
    },
    {
      date: "2024/08/03",
      title: "スポーツイベント 収録",
      type: "image",
      embedUrl: "/images/mw/mw6.JPG", 
      caption: "ディレクション・撮影・SWを担当"
    },
    {
      date: "2024/06/06",
      title: "スポーツイベント 収録",
      type: "image",
      embedUrl: "/images/mw/mw7.JPG", 
      caption: "ディレクション・撮影・SWを担当"
    },
    {
      date: "2024/03/18",
      title: "ダンス公演 収録",
      type: "image",
      embedUrl: "/images/mw/mw4.JPG", 
      caption: "ディレクション・撮影・SW・編集を担当"
    },
    {
      date: "2024/01/14",
      title: "空手道場 演武会 収録",
      type: "image",
      embedUrl: "/images/mw/mw5.JPG", 
      caption: "撮影・編集を担当"
    },
    {
      date: "2022/11/05",
      title: "第49回雙峰祭ダイジェスト【筑波大学学園祭】",
      type: "video",
      embedUrl: "https://www.youtube.com/embed/P9fxQRrqruE?si=BnHQEcHvkJzbSXzq",
      caption: "撮影・CG・アニメーションを担当"
    },
  ];

  const reduceMotion = useReducedMotion();
  const variants = useMemo(() => {
    const baseEase = [0.16, 1, 0.3, 1];
    return {
      container: {
        initial: { opacity: 0, y: reduceMotion ? 0 : 12 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0 : 0.6, ease: baseEase },
        },
      },
      list: {
        animate: {
          transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: reduceMotion ? 0 : 0.1 },
        },
      },
      item: {
        initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0 : 0.55, ease: baseEase },
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
  }, [reduceMotion]);

  return (
    <motion.div
      className="mx-auto max-w-6xl px-6 py-12 text-white"
      variants={variants.container}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={variants.item} className="mb-10 max-w-3xl">
        <div className="flex items-center gap-4 text-gray-500">
          <span className="text-[11px] tracking-[0.45em]">MOVIE WORKS</span>
          <motion.span variants={variants.rule} className="h-px w-16 origin-left bg-white/40" />
        </div>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Movie Works</h1>
        <p className="mt-4 text-sm text-gray-300 md:text-base">
          {"本ページではクライアント様より直接ご依頼をいただいた案件のみを掲載しております。"}
        </p>
      </motion.div>

      <motion.div variants={variants.list} className="border-t border-white/10">
        <motion.div variants={variants.item} className="border-b border-white/10 py-10">
          <FeaturedItem
            date={featured.date}
            title={featured.title}
            embedUrl={featured.embedUrl}
            caption={featured.caption}
          />
        </motion.div>

        <motion.div variants={variants.list} className="lg:grid lg:grid-cols-2">
          {items.map((item, idx) => {
            const isRight = idx % 2 === 1;
            const hasTopBorder = idx > 0;
            const topBorderClass = hasTopBorder ? "border-t" : "";
            const lgTopBorderReset = idx === 1 ? "lg:border-t-0" : "";
            const columnBorderClass = isRight ? "lg:border-l lg:pl-8" : "lg:pr-8";

            return (
              <motion.div
                key={idx}
                variants={variants.item}
                className={`py-8 border-white/10 ${topBorderClass} ${lgTopBorderReset} ${columnBorderClass}`}
              >
                <MediaItem
                  date={item.date}
                  title={item.title}
                  type={item.type}
                  embedUrl={item.embedUrl}
                  caption={item.caption}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** 各作品カード: 日付(小文字) + タイトル(1行) + [左: 埋め込み, 右: キャプション] */
function MediaItem({ date, title, type, embedUrl, caption }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* 日付をタイトルの上に表示 (小文字) */}
      <div>
        <div className="text-xs text-gray-500 tracking-[0.35em] whitespace-nowrap overflow-hidden text-ellipsis">
          {date}
        </div>

        {/* タイトル(1行) */}
        <h2
          className="
            text-2xl sm:text-3xl font-semibold tracking-tight
            block max-w-full
            whitespace-nowrap 
            overflow-hidden 
            text-ellipsis
          "
          style={{ lineHeight: "1.2" }}
        >
          {title}
        </h2>
      </div>

      {/* 左: メディア(幅300×高さ169) + 右: キャプション */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-full sm:max-w-[300px] aspect-video relative overflow-hidden rounded-lg shrink-0">
          {type === "video" ? (
            <VideoEmbed embedUrl={embedUrl} title={title} />
          ) : (
            <ImageEmbed imageUrl={embedUrl} title={title} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}

/** 先頭の注目作品カード（大きめ表示） */
function FeaturedItem({ date, title, embedUrl, caption }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <div className="text-xs text-gray-500 tracking-[0.35em] whitespace-nowrap overflow-hidden text-ellipsis">
          {date}
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      <div className="w-full aspect-video relative overflow-hidden rounded-lg mb-4">
        <VideoEmbed embedUrl={embedUrl} title={title} />
      </div>
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
        {caption}
      </p>
    </div>
  );
}

/** 動画埋め込み(iframe) */
function VideoEmbed({ embedUrl, title }) {
  return (
    <iframe
      src={embedUrl}
      title={title}
      className="absolute top-0 left-0 w-full h-full"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

/** 画像埋め込み - 300×169 */
function ImageEmbed({ imageUrl, title }) {
  return (
    <img
      src={imageUrl}
      alt={title}
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
  );
}
