"use client";

import React, { useState, useEffect } from "react";
import PhotoCard from "../components/PhotoCard";

export default function PhotoGrid({ images }) {
  const totalImages = images.length;
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // 画像ロード完了毎にカウント
  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  // ロード進捗 (0~100)
  const progress = Math.round((loadedCount / totalImages) * 100);

  // プログレス完了時のフェードアウト
  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
        const removeTimer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(removeTimer);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [progress]);

  // 4秒経過で強制フェードアウト
  useEffect(() => {
    if (!isLoading) return;
    const maxTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 500);
    }, 4000);
    return () => clearTimeout(maxTimer);
  }, [isLoading]);

  const overlayClass = fadeOut
    ? "opacity-0 transition-opacity duration-500"
    : "opacity-100";
  const contentClass = fadeOut
    ? "opacity-100 transition-opacity duration-500"
    : "opacity-0";

  // モーダル表示用
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

  // 外部リンク用
  const handleOpenPost = (postUrl) => {
    window.open(postUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && (
        <div
          className={
            `fixed inset-0 z-50 flex flex-col items-center justify-center bg-black ${overlayClass}`
          }
        >
          <span
            className="text-white text-2xl mb-4"
            style={{ fontFamily: "'Avenir Next', 'Yu Gothic', sans-serif" }}
          >
            {progress}%
          </span>
          <div className="w-[500px] h-1 bg-black relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className={contentClass}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((item, idx) =>
            item.isLocal ? (
              <PhotoCard
                key={idx}
                src={item.src}
                onClick={() => handleOpenModal(item.src)}
                onImageLoad={handleImageLoad}
              />
            ) : (
              <PhotoCard
                key={idx}
                src={item.src}
                onClick={() => handleOpenPost(item.postUrl)}
                onImageLoad={handleImageLoad}
              />
            )
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
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
