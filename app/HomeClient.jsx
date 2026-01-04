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
  const primaryLinks = [
    { href: '/photo', label: 'Photo works', image: '/photo_image.jpg' },
    { href: '/movie', label: 'Movie works', image: '/movie-image.jpg' },
  ];
  const secondaryLinks = [
    { href: '/price', label: 'Price', tag: 'PRICE', detail: '料金・プラン' },
    { href: '/about', label: 'About', tag: 'ABOUT', detail: '経歴・所有機材' },
    { href: '/contact', label: 'Contact', tag: 'CONTACT', detail: 'ご相談・お問い合わせ' },
  ];

  const renderPrimaryCard = ({ href, label, image }, className) => (
    <Link
      key={href}
      href={href}
      className={`relative group flex items-center justify-center overflow-hidden bg-black ${className}`}
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-70 transition duration-300" />
      <span className="relative text-2xl font-semibold text-black opacity-0 group-hover:opacity-100 transition duration-300">
        {label}
      </span>
    </Link>
  );

  const renderSecondaryCard = ({ href, label, tag, detail }, index) => (
    <motion.div
      key={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        href={href}
        className="group relative flex h-full min-h-[30vh] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent px-7 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:-translate-y-1 sm:min-h-[38vh] md:min-h-[52vh]"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '160px 160px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)] opacity-30 transition duration-500 group-hover:opacity-60" />
        <div className="absolute -top-24 right-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 text-gray-400">
            <span className="text-[11px] tracking-[0.45em]">{tag}</span>
            <span className="h-px w-10 origin-left bg-white/20 transition-all duration-300 group-hover:w-20 group-hover:bg-white/70" />
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{label}</h2>
          <p className="mt-3 text-sm text-gray-300">{detail}</p>
        </div>
        <div className="relative z-10 mt-10 flex items-center gap-4 text-xs tracking-[0.35em] text-gray-400">
          <span>VIEW</span>
          <span className="h-px w-12 origin-left bg-white/20 transition-all duration-300 group-hover:w-20 group-hover:bg-white/70" />
        </div>
      </Link>
    </motion.div>
  );

  // フレーズ表示タイミング
  useEffect(() => {
    if (visibleCount < phrasesWithComma.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 600);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  // スライドショー切り替え: テキスト全表示後に開始
  useEffect(() => {
    if (visibleCount < phrasesWithComma.length || !slides.length) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length, visibleCount]);

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
                alt={`iT4P studio showcase ${slideIndex + 1}`}
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
        {primaryLinks.map((link) => renderPrimaryCard(link, 'flex-1'))}
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-t border-white/10 bg-black"
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 60%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center gap-4 text-gray-500">
            <span className="text-[11px] tracking-[0.45em]">EXPLORE</span>
            <span className="h-px w-16 origin-left bg-white/30" />
          </div>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">More from iT4P studio</h2>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            料金やプロフィール、相談窓口をまとめてご案内します。
          </p>
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {secondaryLinks.map((link, index) => renderSecondaryCard(link, index))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
