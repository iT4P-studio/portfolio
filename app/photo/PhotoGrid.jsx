'use client';

import React, { useState, useEffect, useRef } from 'react';
import PhotoCard from '../components/PhotoCard';
import { EXIF_PICK_FIELDS, buildExifInfo } from './exifFormat';

export default function PhotoGrid({ images }) {
  const totalImages = images.length;
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(totalImages > 0);
  const [fadeOut, setFadeOut] = useState(false);

  // 画像ロード完了毎にカウント（成功・失敗どちらも）
  const handleImageLoad = () => {
    setLoadedCount(prev => prev + 1);
  };

  // ロード進捗 (0~100)
  const progress = totalImages > 0
    ? Math.round((loadedCount / totalImages) * 100)
    : 100;

  // プログレス完了時のフェードアウト
  useEffect(() => {
    if (!isLoading) return;
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
        const removeTimer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(removeTimer);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [progress, isLoading]);

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
    ? 'opacity-0 transition-opacity duration-500'
    : 'opacity-100';
  const contentClass = fadeOut || !isLoading
    ? 'opacity-100 transition-opacity duration-500'
    : 'opacity-0';

  // モーダル表示用
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState('');
  const [selectedExif, setSelectedExif] = useState(null);
  const attemptedModalRef = useRef(new Set());

  const handleOpenModal = (src, exif) => {
    setSelectedSrc(src);
    setSelectedExif(exif || null);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedSrc('');
    setSelectedExif(null);
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen || !selectedSrc || selectedExif) return;
    if (!selectedSrc.startsWith('/photos/')) return;
    if (attemptedModalRef.current.has(selectedSrc)) return;
    attemptedModalRef.current.add(selectedSrc);
    let cancelled = false;

    const loadExif = async () => {
      try {
        const { default: exifr } = await import('exifr');
        const raw = await exifr.parse(selectedSrc, { pick: EXIF_PICK_FIELDS });
        const info = buildExifInfo(raw);
        if (!cancelled) {
          setSelectedExif(info);
        }
      } catch {
        if (!cancelled) {
          setSelectedExif(null);
        }
      }
    };

    loadExif();

    return () => {
      cancelled = true;
    };
  }, [modalOpen, selectedSrc, selectedExif]);

  // 外部リンク用
  const handleOpenPost = postUrl => {
    window.open(postUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black ${overlayClass}`}>
          <span className="text-white text-2xl mb-4" style={{ fontFamily: "'Avenir Next', 'Yu Gothic', sans-serif" }}>
            {progress}%
          </span>
          <div className="w-[80vw] max-w-[500px] h-1 bg-black relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-white transition-all" style={{ width: `${progress}%` }} />
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
                exif={item.exif}
                onClick={() => handleOpenModal(item.src, item.exif)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={handleCloseModal}>
          <div className="relative max-w-[90%] max-h-[90%]" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded bg-gray-700/80 text-white text-2xl leading-none hover:bg-gray-600 transition-colors"
            >
              &times;
            </button>
            <div className="relative">
              <img src={selectedSrc} alt="" className="w-full h-full object-contain" style={{ maxHeight: '90vh', maxWidth: '90vw' }} />
              {selectedExif && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-10">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-100 leading-relaxed">
                    {selectedExif.camera && <span>カメラ: {selectedExif.camera}</span>}
                    {selectedExif.lens && <span>レンズ: {selectedExif.lens}</span>}
                    {selectedExif.shutterSpeed && <span>シャッタースピード: {selectedExif.shutterSpeed}</span>}
                    {selectedExif.aperture && <span>F値: {selectedExif.aperture}</span>}
                    {selectedExif.iso && <span>ISO感度: {selectedExif.iso}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
