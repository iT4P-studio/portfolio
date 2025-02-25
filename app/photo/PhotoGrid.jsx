"use client";
import React, { useState, useEffect } from "react";
import PhotoCard from "../components/PhotoCard";

export default function PhotoGrid({ images }) {
  // 合計画像数・ロード完了数
  const totalImages = images.length;
  const [loadedCount, setLoadedCount] = useState(0);

  // 1枚ロード完了時
  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  // ロード進捗 (0 ~ 100)
  const progress = Math.round((loadedCount / totalImages) * 100);

  // ロード画面を表示するかどうか
  const [isLoading, setIsLoading] = useState(true);
  // フェードアウト開始フラグ
  const [fadeOut, setFadeOut] = useState(false);

  // ロード画面とメインコンテンツのフェード用クラス名
  const overlayClass = fadeOut
    ? "opacity-0 transition-opacity duration-500"
    : "opacity-100";
  const contentClass = fadeOut
    ? "opacity-1 transition-opacity duration-500"
    : "opacity-0";

  /**
   * 1) progressが100になったら0.5秒待ってフェードアウト開始 (fadeOut=true)
   * 2) フェードアウトが終わる0.5秒後に isLoading=false でロード画面をDOMから削除
   */
  useEffect(() => {
    if (progress === 100) {
      // 0.5秒後にフェードアウト開始
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);

        // さらに0.5秒後にロード画面を削除
        const removeTimer = setTimeout(() => {
          setIsLoading(false);
        }, 500);

        return () => clearTimeout(removeTimer);
      }, 500);

      return () => clearTimeout(fadeTimer);
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
      {/* 
        ロード画面 (Overlay)
        isLoading が true のあいだだけDOMに存在。
        fadeOutフラグでオーバーレイをフェードアウト。
      */}
      {isLoading && (
        <div
          className={`
            fixed inset-0 z-50
            flex flex-col items-center justify-center
            bg-black
            ${overlayClass}
          `}
        >
          {/* パーセント表示 + フォント指定 */}
          <span
            className="text-white text-2xl mb-4"
            style={{ fontFamily: "'Avenir Next', 'Yu Gothic', sans-serif" }}
          >
            {progress}%
          </span>
          {/* 白枠ゲージ (幅300px,高さ2px) */}
          <div className="w-[500px] h-1 bg-black relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/**
       * メインコンテンツ
       * ロード中は opacity-0 → fadeOut=true で opacity-1 に
       */}
      <div className={`${contentClass}`}>
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
                  onImageLoad={handleImageLoad}
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
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
