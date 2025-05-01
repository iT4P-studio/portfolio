// app/HomeClient.jsx (Client Component)
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeClient({ slides }) {
  const phrasesWithComma = ['感動を、', '情熱を、', '一瞬を'];
  const phrasesWithoutComma = ['感動を', '情熱を', '一瞬を'];
  const [visibleCount, setVisibleCount] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  // フレーズ表示タイミング
  useEffect(() => {
    if (visibleCount < phrasesWithComma.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 600);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  // スライド切り替え
  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative flex flex-col">
      {/* イントロ＆スライドショーセクション */}
      <div className="relative h-screen w-full overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          {slides.length > 0 && (
            <motion.div
              key={slideIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <Image
                src={slides[slideIndex]}
                alt="slide"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* オーバーレイとテキスト */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white overflow-hidden">
          <motion.div className="flex flex-col items-center space-y-4 justify-center sm:flex-row sm:space-x-4 sm:space-y-0 z-10">
            {phrasesWithComma.map((_, idx) => (
              <motion.h1
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={visibleCount > idx ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.25 }}
                className="text-5xl sm:text-7xl font-serif inline-block whitespace-nowrap"
              >
                <span className="sm:hidden">{phrasesWithoutComma[idx]}</span>
                <span className="hidden sm:inline">{phrasesWithComma[idx]}</span>
              </motion.h1>
            ))}
          </motion.div>

          {visibleCount >= phrasesWithComma.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute bottom-16 z-10"
            >
              <svg className="w-16 h-16 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* Photo/Movie リンクセクション */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: phrasesWithComma.length * 0.25 + 0.5 }}
        className="relative z-10 flex flex-col md:flex-row h-screen"
      >
        <Link href="/photo" className="relative group flex-1 bg-black flex items-center justify-center">
          <Image
            src="/photo_image.jpg"
            alt="Photo works"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-70 transition duration-300" />
          <span className="relative text-2xl font-semibold text-black opacity-0 group-hover:opacity-100 transition duration-300">
            Photo works
          </span>
        </Link>
        <Link href="/movie" className="relative group flex-1 bg-black flex items-center justify-center">
          <Image
            src="/movie-image.jpg"
            alt="Movie works"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-70 transition duration-300" />
          <span className="relative text-2xl font-semibold text-black opacity-0 group-hover:opacity-100 transition duration-300">
            Movie works
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
