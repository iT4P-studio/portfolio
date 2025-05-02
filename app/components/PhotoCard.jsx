'use client';
import Image from 'next/image';
import React from 'react';
import useIntersection from './useIntersection';

export default function PhotoCard({ src, onClick, onImageLoad }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1, rootMargin: '200px' });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out opacity-0 translate-y-8 ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
    >
      <button type="button" className="block w-full aspect-square overflow-hidden" onClick={onClick}>
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
      </button>
    </div>
  );
}