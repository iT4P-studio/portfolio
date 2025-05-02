// components/Header.jsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { href: '/photo', label: 'Photo works' },
    { href: '/movie', label: 'Movie works' },
    { href: '/price', label: 'Price' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-black border-b border-gray-600">
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
          <div className="hidden md:flex md:flex-wrap md:gap-4 md:items-center">
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
            <a href="https://twitter.com/your_x_profile" target="_blank" rel="noopener noreferrer" className="px-2">
              <img src="/icons/x.png" alt="X" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/your_instagram_profile" target="_blank" rel="noopener noreferrer" className="px-2">
              <img src="/icons/instagram.png" alt="Instagram" className="h-6 w-6" />
            </a>
          </div>

          {/* モバイル用ハンバーガボタン */}
          <button className="md:hidden" onClick={() => setMenuOpen(true)}>
            <img src="/menu-btn.png" alt="Menu" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-3/4 bg-black transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          ×
        </button>
        <nav className="mt-16 flex flex-col space-y-6 px-6">
          <Link href="/" className="text-white text-xl" onClick={() => setMenuOpen(false)}>
            Home
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
          {/* モバイルメニュー: SNSアイコン （Contactの下） */}
          <div className="pt-4 flex space-x-4">
            <a href="https://twitter.com/your_x_profile" target="_blank" rel="noopener noreferrer">
              <img src="/icons/x.png" alt="X" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/your_instagram_profile" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" className="h-6 w-6" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
