// components/Header.jsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isEn, setLang } = useLanguage();
  const navLinks = [
    { href: '/photo', label: isEn ? 'Photo Works' : '写真作品' },
    { href: '/movie', label: isEn ? 'Movie Works' : '映像作品' },
    { href: '/price', label: isEn ? 'Price' : '料金' },
    { href: '/about', label: isEn ? 'About' : '概要' },
    { href: '/contact', label: isEn ? 'Contact' : 'お問い合わせ' },
  ];
  const bannerText = isEn
    ? 'Operations are currently suspended since 2026/4/1.'
    : '2026/4/1〜現在、業務を停止しております。';

  return (
    <header className="bg-black border-b border-white/10">
      <nav className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4">
        {/* 左端: ロゴボタン (全画面共通) */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/"
            className="group relative flex items-center px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            <img
              src="/logo_W.png"
              alt="Home"
              className="h-6 w-auto transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src="/logo_B.png"
              alt="Home Hover"
              className="absolute top-1/2 left-1/2 h-6 w-auto -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>
        </div>

        {/* 中央～右: ナビリンク + SNSアイコン + ハンバーガ */}
        <div className="flex items-center flex-wrap gap-4">
          {/* 大画面ナビ + SNSアイコン */}
          <div className="hidden lg:flex lg:flex-wrap lg:gap-4 lg:items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            {/* SNSアイコン (デスクトップ) */}
            <a href="https://x.com/it4p_studio" target="_blank" rel="noopener noreferrer" className="px-2">
              <img src="/icons/x.png" alt="X" className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/it4hara5a/" target="_blank" rel="noopener noreferrer" className="px-2">
              <img src="/icons/instagram.png" alt="Instagram" className="h-6 w-6" />
            </a>
            <div className="ml-2 flex items-center rounded-full border border-white/20 text-[11px] tracking-[0.25em] text-white">
              <button
                type="button"
                onClick={() => setLang('ja')}
                className={`px-3 py-1 transition-colors ${isEn ? 'text-gray-400 hover:text-white' : 'text-white'}`}
              >
                日本語
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 transition-colors ${isEn ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* モバイル用ハンバーガボタン */}
          <button className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <img src="/menu-btn.png" alt="Menu" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <div className="border-t border-white/10 bg-black">
        <div className="container mx-auto px-4 py-2 text-center text-xs tracking-[0.3em] text-gray-400 sm:text-sm">
          {bannerText}
        </div>
      </div>

      {/* モバイルメニュー */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-3/4 bg-black transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          ×
        </button>
        <nav className="mt-16 flex flex-col space-y-6 px-6">
          <Link href="/" className="text-white text-xl" onClick={() => setMenuOpen(false)}>
            {isEn ? 'Home' : 'ホーム'}
          </Link>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-xl"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setLang('ja')}
              className={`rounded-full border px-4 py-2 text-xs tracking-[0.25em] ${isEn ? 'border-white/20 text-gray-400' : 'border-white/60 text-white'}`}
            >
              日本語
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full border px-4 py-2 text-xs tracking-[0.25em] ${isEn ? 'border-white/60 text-white' : 'border-white/20 text-gray-400'}`}
            >
              EN
            </button>
          </div>
          {/* モバイルメニュー: SNSアイコン （Contactの下） */}
          <div className="pt-4 flex space-x-4">
            <a href="https://x.com/it4p_studio" target="_blank" rel="noopener noreferrer">
              <img src="/icons/x.png" alt="X" className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/it4hara5a/" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" className="h-6 w-6" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
