"use client";

import React from "react";

/**
 * MovieWorksページ
 * - 動画一覧を配列で管理
 * - 各動画は (タイトル + iframe埋め込み) を表示
 * - YouTube / Vimeo 埋め込みURL を受け取り、<iframe> で表示
 */

export default function MovieWorksPage() {
  // タイトル + 埋め込みURL のリスト
  const videos = [
    {
      title: "第49回雙峰祭ダイジェスト【筑波大学学園祭】（撮影・CG・アニメーション）",
      embedUrl: "https://www.youtube.com/embed/P9fxQRrqruE?si=BnHQEcHvkJzbSXzq", 
    },
    // さらに作品を追加したければ、配列に要素を追加
    // { title: "Another Work", embedUrl: "..." },
  ];

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Movie Works</h1>
      <p className="mb-4">
        
      </p>

      <div className="space-y-8">
        {videos.map((video, idx) => (
          <VideoItem
            key={idx}
            title={video.title}
            embedUrl={video.embedUrl}
          />
        ))}
      </div>
    </div>
  );
}

/** 1つの作品（タイトル + 埋め込み動画） */
function VideoItem({ title, embedUrl }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
        {/* 
          iframe埋め込み: 
          - YouTube => https://www.youtube.com/embed/VIDEO_ID 
          - Vimeo   => https://player.vimeo.com/video/VIDEO_ID 
        */}
        <iframe
          src={embedUrl}
          title={title}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
