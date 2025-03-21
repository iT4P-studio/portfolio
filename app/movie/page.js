"use client";

import React from "react";

/**
 * MovieWorksページ
 * - ある程度幅が狭い場合は1列表示にし、幅が lg(1024px) 以上あれば2列
 * - タイトルが2行にならないように whitespace-nowrap + overflow-hidden + text-ellipsis
 * - キャプションが枠外に飛び出さない程度にカード幅を調整
 */

export default function MovieWorksPage() {
  // タイトル + 埋め込み(動画/画像) + caption
  const items = [
    {
      title: "第49回雙峰祭ダイジェスト【筑波大学学園祭】",
      type: "video",
      embedUrl: "https://www.youtube.com/embed/P9fxQRrqruE?si=BnHQEcHvkJzbSXzq",
      caption: "撮影・CG・アニメーションを担当"
    },
    {
      title: "医療関連施設 紹介動画制作",
      type: "image",
      embedUrl: "/images/mw/mw1.JPG", 
      caption: "構成・撮影・音響・編集を担当"
    },
    {
      title: "ダンス公演 収録",
      type: "image",
      embedUrl: "/images/mw/mw2.JPG", 
      caption: "ディレクション・撮影・SW・編集を担当"
    },
    {
      title: "アカペラ公演 収録",
      type: "image",
      embedUrl: "/images/mw/mw3.JPG", 
      caption: "ディレクション・撮影・SW・編集を担当"
    },
    // さらに必要なら追加
  ];

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Movie Works</h1>
      <p className="mb-4">
        
      </p>

      {/* 
        グリッド:
         1列 → lg(1024px)以上で2列 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {items.map((item, idx) => (
          <MediaItem
            key={idx}
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

/** 各作品カード: 「タイトル(1行) + [左:小さい動画or画像][右:キャプション]」 */
function MediaItem({ title, type, embedUrl, caption }) {
  return (
    <div className="bg-black border border-gray-600 p-4 rounded-lg">
      {/* タイトル(1行に収める) */}
      <h2
        className="
          text-2xl font-semibold mb-2 
          block max-w-full 
          whitespace-nowrap 
          overflow-hidden 
          text-ellipsis
        "
        style={{ lineHeight: "1.2" }} /* 文字ぎゅっと詰めるなら */
      >
        {title}
      </h2>

      {/* 左: メディア(幅300×高さ169) + 右: キャプション */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* メディア枠 */}
        <div className="w-[300px] h-[169px] relative overflow-hidden rounded-lg shrink-0">
          {type === "video" ? (
            <VideoEmbed embedUrl={embedUrl} title={title} />
          ) : (
            <ImageEmbed imageUrl={embedUrl} title={title} />
          )}
        </div>
        {/* キャプション */}
        <div className="flex-1">
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            {caption}
          </p>
        </div>
      </div>
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

/** 画像埋め込み */
function ImageEmbed({ imageUrl, title }) {
  return (
    <img
      src={imageUrl}
      alt={title}
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
  );
}
