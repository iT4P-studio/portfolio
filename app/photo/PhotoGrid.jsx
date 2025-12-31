'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import PhotoCard from '../components/PhotoCard';
import { EXIF_PICK_FIELDS, buildExifInfo } from './exifFormat';

export default function PhotoGrid({ images }) {
  const parseDateText = (value) => {
    if (!value) return 0;
    if (value instanceof Date) {
      const ts = value.getTime();
      return Number.isNaN(ts) ? 0 : ts;
    }
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return 0;
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const match = trimmed.match(/^(\d{4})[/:\\-](\d{2})[/:\\-](\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/);
    if (match) {
      const [, y, m, d, hh = '00', mm = '00', ss = '00'] = match;
      const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
      return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };

  const formatModalDate = (value) => {
    if (!value) return null;
    const ts = parseDateText(value);
    if (!ts) return value;
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatIris = (value) => {
    if (value === null || value === undefined) return null;
    const text = String(value).trim();
    if (!text) return null;
    const cleaned = text.replace(/^f\/?/i, '');
    if (!cleaned) return null;
    return `F${cleaned}`;
  };

  const [sortVersion, setSortVersion] = useState(0);
  const exifCacheRef = useRef(new Map());
  const [isMobile, setIsMobile] = useState(false);

  // モーダル表示用
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState('');
  const [selectedExif, setSelectedExif] = useState(null);
  const [modalImageReady, setModalImageReady] = useState(false);
  const [modalExifReady, setModalExifReady] = useState(false);
  const attemptedModalRef = useRef(new Set());

  useEffect(() => {
    images.forEach((item) => {
      if (item?.exif) {
        exifCacheRef.current.set(item.src, item.exif);
      }
    });
  }, [images]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => {
      setIsMobile(media.matches);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const handleExifResolved = (src, exif) => {
    if (!src || !exif) return;
    const cached = exifCacheRef.current.get(src);
    const nextShot = exif?.shotDate || null;
    const prevShot = cached?.shotDate || null;
    if (!cached || nextShot !== prevShot) {
      exifCacheRef.current.set(src, exif);
      setSortVersion((prev) => prev + 1);
    }
  };

  const getSortTs = (item) => {
    const sortTs = Number.isFinite(item?.sortTs) ? item.sortTs : 0;
    if (sortTs > 0) return sortTs;
    const publishedTs = parseDateText(item?.publishedDate);
    if (publishedTs) return publishedTs;
    const cachedExif = item?.src ? exifCacheRef.current.get(item.src) : null;
    const shotDate = cachedExif?.shotDate || item?.exif?.shotDate;
    return parseDateText(shotDate);
  };

  const sortedImages = useMemo(() => {
    return images
      .map((item, idx) => ({ item, idx, sortTs: getSortTs(item) }))
      .sort((a, b) => (b.sortTs - a.sortTs) || (a.idx - b.idx))
      .map(({ item }) => item);
  }, [images, sortVersion]);

  const totalImages = sortedImages.length;
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(totalImages > 0);
  const [fadeOut, setFadeOut] = useState(false);
  const modalShotDate = selectedExif?.shotDate ? formatModalDate(selectedExif.shotDate) : null;
  const modalCamera = selectedExif?.cameraModel || selectedExif?.camera;
  const modalLens = selectedExif?.lens;
  const modalShutter = selectedExif?.shutterSpeed;
  const modalIso = selectedExif?.iso;
  const modalIris = formatIris(selectedExif?.aperture);
  const modalReady = modalImageReady && modalExifReady;

  // 画像ロード完了毎にカウント（成功・失敗どちらも）
  const handleImageLoad = () => {
    setLoadedCount(prev => Math.min(prev + 1, totalImages));
  };

  useEffect(() => {
    setLoadedCount(prev => Math.min(prev, totalImages));
  }, [totalImages]);

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

  const handleOpenModal = (src, exif) => {
    const cachedExif = exif || exifCacheRef.current.get(src) || null;
    setSelectedSrc(src);
    setSelectedExif(cachedExif);
    setModalImageReady(false);
    setModalExifReady(!!cachedExif);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedSrc('');
    setSelectedExif(null);
    setModalImageReady(false);
    setModalExifReady(false);
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen || !selectedSrc) return;
    if (selectedExif) {
      if (!modalExifReady) setModalExifReady(true);
      return;
    }
    if (!selectedSrc.startsWith('/photos/')) {
      if (!modalExifReady) setModalExifReady(true);
      return;
    }
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
          setModalExifReady(true);
        }
      } catch {
        if (!cancelled) {
          setSelectedExif(null);
          setModalExifReady(true);
        }
      }
    };

    loadExif();

    return () => {
      cancelled = true;
    };
  }, [modalOpen, selectedSrc, selectedExif, modalExifReady]);

  // 外部リンク用
  const handleOpenPost = postUrl => {
    window.open(postUrl, '_blank');
  };

  const getDisplaySrc = (item) => {
    if (!item?.src) return '';
    if (!item.isLocal || !isMobile) return item.src;
    const fileName = item.src.split('/').pop();
    return `/photos/mobile/${fileName}`;
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
          {sortedImages.map((item) => {
            const displaySrc = getDisplaySrc(item);
            return item.isLocal ? (
              <PhotoCard
                key={item.src}
                src={displaySrc}
                exifKey={item.src}
                exif={item.exif}
                loading="eager"
                priority
                onClick={(resolvedExif) => handleOpenModal(item.src, resolvedExif || item.exif)}
                onImageLoad={handleImageLoad}
                onExifResolved={handleExifResolved}
              />
            ) : (
              <PhotoCard
                key={item.src}
                src={item.src}
                dateText={item.publishedDate}
                loading="eager"
                priority
                onClick={() => handleOpenPost(item.postUrl)}
                onImageLoad={handleImageLoad}
              />
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={handleCloseModal}>
          <div className="relative max-w-[90%] max-h-[90%]" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              aria-label="Close"
              className={`absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded bg-gray-700/80 text-white text-2xl leading-none transition-opacity duration-300 ${modalReady ? 'opacity-100' : 'opacity-0 pointer-events-none'} hover:bg-gray-600`}
            >
              &times;
            </button>
            <div className="relative">
              <img
                src={selectedSrc}
                alt=""
                className={`w-full h-full object-contain transition-opacity duration-300 ${modalReady ? 'opacity-100' : 'opacity-0'}`}
                style={{ maxHeight: '90vh', maxWidth: '90vw' }}
                onLoad={() => setModalImageReady(true)}
                onError={() => setModalImageReady(true)}
              />
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
                  modalReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                aria-hidden={modalReady}
              >
                <div className="text-[11px] uppercase tracking-[0.45em] text-gray-200">Loading</div>
                <div className="h-px w-28 overflow-hidden bg-white/25">
                  <div className="h-px w-1/2 bg-white/80 animate-pulse" />
                </div>
              </div>
              {selectedExif && modalReady && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-10">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-100 leading-relaxed">
                    {modalShotDate && <span>撮影日：{modalShotDate}</span>}
                    {modalCamera && <span>カメラ：{modalCamera}</span>}
                    {modalLens && <span>レンズ：{modalLens}</span>}
                    {modalShutter && <span>SS：{modalShutter}</span>}
                    {modalIso && <span>ISO：{modalIso}</span>}
                    {modalIris && <span>IRIS：{modalIris}</span>}
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
