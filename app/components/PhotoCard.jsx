'use client';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { EXIF_PICK_FIELDS, buildExifInfo } from '../photo/exifFormat';
import useIntersection from './useIntersection';

export default function PhotoCard({
  src,
  exif,
  dateText,
  dateLabel,
  loading = 'lazy',
  priority = false,
  decoding = 'async',
  deferUntilVisible = false,
  enableClientExif = false,
  exifKey,
  onClick,
  onImageLoad,
  onExifResolved,
}) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1, rootMargin: '200px' });
  const [resolvedExif, setResolvedExif] = useState(exif || null);
  const attemptedSrcRef = useRef(null);
  const shouldRenderImage = !deferUntilVisible || isVisible;

  useEffect(() => {
    if (exif) {
      setResolvedExif(exif);
    }
  }, [exif]);

  useEffect(() => {
    if (!resolvedExif || !onExifResolved) return;
    const key = exifKey || src;
    onExifResolved(key, resolvedExif);
  }, [resolvedExif, onExifResolved, src, exifKey]);

  useEffect(() => {
    if (!enableClientExif || resolvedExif || !isVisible || !src?.startsWith('/photos/')) return;
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

  const shotDate = resolvedExif?.shotDate;
  const displayDate = dateText || shotDate;
  const displayLabel = dateText ? dateLabel : null;
  const hasExif = !!displayDate;

  const handleClick = () => {
    if (onClick) {
      onClick(resolvedExif || null);
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
    >
      <button type="button" className="relative block w-full aspect-square overflow-hidden" onClick={handleClick}>
        {shouldRenderImage && (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            loading={loading}
            priority={priority}
            decoding={decoding}
            onLoadingComplete={onImageLoad}
            onError={onImageLoad}
          />
        )}
        {hasExif && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-2 pb-2 pt-6">
            <div className="text-[11px] text-gray-100 tracking-[0.18em]">
              {displayLabel ? `${displayLabel}: ${displayDate}` : displayDate}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
