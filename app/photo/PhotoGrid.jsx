"use client";
import React, { useState, useEffect } from "react";
import PhotoCard from "../components/PhotoCard";

export default function PhotoGrid({ images }) {
  // 合計画像数とロード完了数
  const totalImages = images.length;
  const [loadedCount, setLoadedCount] = useState(0);

  // 1枚ロード完了時に呼ばれるコールバック
  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  // 進捗率 (0~100)
  const progress = Math.round((loadedCount / totalImages) * 100);

  // ロード中かどうかを管理するフラグ
  const [isLoading, setIsLoading] = useState(true);

  // すべての画像が読み込まれ、progress===100 になったら
  // 1秒だけキープしてからロード画面を消す
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // --------------------
  // 既存機能: モーダル表示や外部リンク
  // --------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState("");

  const handleOpenModal = (src) => {
    setSelectedSrc(src);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSrc("");
    setModalOpen(false);
  };

  const handleOpenPost = (postUrl) => {
    window.open(postUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* -------------------------
          ロード画面 (Overlay)
         ------------------------- */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          {/* パーセント表示 (フォント適用) */}
          <span
            className="text-white text-2xl mb-4"
            style={{ fontFamily: "'Avenir Next', 'Yu Gothic', sans-serif" }}
          >
            {progress}%
          </span>
          {/* 白いゲージ枠: width=300px, height=2pxで細長く */}
          <div className="w-[500px] h-1 bg-black relative overflow-hidden">
            {/* 中身 (黒バー) */}
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ギャラリー */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((item, idx) => {
          // item = { src, isLocal, postUrl? }
          if (item.isLocal) {
            // ローカル画像: クリック → モーダル拡大
            return (
              <PhotoCard
                key={idx}
                src={item.src}
                onClick={() => handleOpenModal(item.src)}
                onImageLoad={handleImageLoad} // 画像1枚読込完了時に呼ぶ
              />
            );
          } else {
            // X画像: クリック → 投稿URLへ
            return (
              <PhotoCard
                key={idx}
                src={item.src}
                onClick={() => handleOpenPost(item.postUrl)}
                onImageLoad={handleImageLoad}
              />
            );
          }
        })}
      </div>

      {/* 既存: モーダル (ローカル画像のみ) */}
      {modalOpen && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-70
          "
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-[90%] max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>
            <img
              src={selectedSrc}
              alt=""
              className="w-full h-full object-contain"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
