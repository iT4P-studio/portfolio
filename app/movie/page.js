"use client";

import React from "react";

/**
 * MovieWorksページ
 * - 幅が狭いと1列, lg以上で2列
 * - 日付を「タイトルの上」に表示 (小文字)
 * - タイトルは1行に収める (whitespace-nowrap)
 */

export default function MovieWorksPage() {
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
      date: "2024/03/18",
      title: "ダンス公演 収録",
      type: "image",
      embedUrl: "/images/mw/mw4.JPG", 
      caption: "ディレクション・撮影・SW・編集を担当"
    },
    {
      date: "2022/11/05",
      title: "第49回雙峰祭ダイジェスト【筑波大学学園祭】",
      type: "video",
      embedUrl: "https://www.youtube.com/embed/P9fxQRrqruE?si=BnHQEcHvkJzbSXzq",
      caption: "撮影・CG・アニメーションを担当"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Movie Works</h1>
      <p className="mb-4">
        {"本ページではクライアント様より直接ご依頼をいただいた案件のみを掲載しております。"}
      </p>

      {/* 1列 → lg(1024px)以上で2列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {items.map((item, idx) => (
          <MediaItem
            key={idx}
            date={item.date}
            title={item.title}
            type={item.type}
            embedUrl={item.embedUrl}
            caption={item.caption}
          />
        ))}
      </div>
    </div>
  );
}

/** 各作品カード: 日付(小文字) + タイトル(1行) + [左: 埋め込み, 右: キャプション] */
function MediaItem({ date, title, type, embedUrl, caption }) {
  return (
    <div className="bg-black border border-gray-600 p-4 rounded-lg">
      {/* 日付をタイトルの上に表示 (小文字) */}
      <div className="text-sm text-gray-400 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {date}
      </div>

      {/* タイトル(1行) */}
      <h2
        className="
          text-2xl font-semibold
          block max-w-full
          whitespace-nowrap 
          overflow-hidden 
          text-ellipsis
          mb-2
        "
        style={{ lineHeight: "1.2" }}
      >
        {title}
      </h2>

      {/* 左: メディア(幅300×高さ169) + 右: キャプション */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-[300px] h-[169px] relative overflow-hidden rounded-lg shrink-0">
          {type === "video" ? (
            <VideoEmbed embedUrl={embedUrl} title={title} />
          ) : (
            <ImageEmbed imageUrl={embedUrl} title={title} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}

/** 動画埋め込み(iframe) - 300×169 */
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
