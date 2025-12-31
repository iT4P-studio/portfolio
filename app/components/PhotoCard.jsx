'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { EXIF_PICK_FIELDS, buildExifInfo } from '../photo/exifFormat';
import useIntersection from './useIntersection';

export default function PhotoCard({ src, exif, onClick, onImageLoad }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1, rootMargin: '200px' });
  const [resolvedExif, setResolvedExif] = useState(exif || null);
  const attemptedSrcRef = useRef(null);

  useEffect(() => {
    if (exif) {
      setResolvedExif(exif);
    }
  }, [exif]);

  useEffect(() => {
    if (resolvedExif || !isVisible || !src?.startsWith('/photos/')) return;
    if (attemptedSrcRef.current === src) return;
    attemptedSrcRef.current = src;
    let cancelled = false;

    const loadExif = async () => {
      try {
        const { default: exifr } = await import('exifr');
        const raw = await exifr.parse(src, { pick: EXIF_PICK_FIELDS });
        const info = buildExifInfo(raw);
        if (!cancelled) {
          setResolvedExif(info);
        }
      } catch {
        if (!cancelled) {
          setResolvedExif(null);
        }
      }
    };

    loadExif();

    return () => {
      cancelled = true;
    };
  }, [resolvedExif, isVisible, src]);

  const hasExif = !!(
    resolvedExif &&
    (resolvedExif.camera ||
      resolvedExif.lens ||
      resolvedExif.shutterSpeed ||
      resolvedExif.aperture ||
      resolvedExif.iso)
  );

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
    >
      <button type="button" className="relative block w-full aspect-square overflow-hidden" onClick={onClick}>
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          loading="eager"
          priority
          onLoadingComplete={onImageLoad}
          onError={onImageLoad}
        />
        {hasExif && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-2 pb-2 pt-6">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-100 leading-relaxed">
              {resolvedExif?.camera && <span>カメラ: {resolvedExif.camera}</span>}
              {resolvedExif?.lens && <span>レンズ: {resolvedExif.lens}</span>}
              {resolvedExif?.shutterSpeed && <span>シャッタースピード: {resolvedExif.shutterSpeed}</span>}
              {resolvedExif?.aperture && <span>F値: {resolvedExif.aperture}</span>}
              {resolvedExif?.iso && <span>ISO感度: {resolvedExif.iso}</span>}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
