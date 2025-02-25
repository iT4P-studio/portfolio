"use client";
import React, { useState } from "react";
import PhotoCard from "../components/PhotoCard";

export default function PhotoGrid({ images }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState("");

  // ローカル画像クリック時に拡大表示
  const handleOpenModal = (src) => {
    setSelectedSrc(src);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSrc("");
    setModalOpen(false);
  };

  // X画像クリック時にポストURLへ遷移（省略している場合は不要）
  const handleOpenPost = (postUrl) => {
    window.open(postUrl, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
              />
            );
          } else {
            // X画像: クリック → 投稿URLへ
            return (
              <PhotoCard
                key={idx}
                src={item.src}
                onClick={() => handleOpenPost(item.postUrl)}
              />
            );
          }
        })}
      </div>

      {/* モーダル (ローカル画像のみ) */}
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
            {/* 閉じるボタン */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>

            {/*
              ここで画像を「画面全体で見切れない程度」に大きく表示。
              max-w-[90%], max-h-[90%] に加え、object-contain でアスペクト比維持
            */}
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
