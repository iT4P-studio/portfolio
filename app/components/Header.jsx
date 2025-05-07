// components/Header.jsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { href: '/photo',   label: 'Photo works' },
    { href: '/movie',   label: 'Movie works' },
    { href: '/price',   label: 'Price' },
    { href: '/about',   label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/app',     label: 'App' },
  ];

  return (
    <header className="bg-black border-b border-gray-600">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* ロゴ */}
        <div className="flex items-center">
          <Link href="/" className="group relative flex items-center px-4 py-2 text-white hover:bg-white hover:text-black transition-colors">
            <img src="/logo_W.png" alt="Home" className="h-6 w-auto group-hover:opacity-0 transition-opacity" />
            <img src="/logo_B.png" alt="Home Hover" className="absolute inset-0 m-auto h-6 w-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* ナビ・SNS */}
        <div className="flex items-center space-x-4">
          {/* デスクトップ用ナビ */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-white hover:bg-white hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* SNSアイコン（デスクトップ） */}
          <div className="hidden md:flex space-x-4">
            <a href="https://twitter.com/your_x_profile" target="_blank" rel="noopener noreferrer">
              <img src="/icons/x.png" alt="X" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/your_instagram_profile" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" className="h-6 w-6" />
            </a>
          </div>

          {/* モバイル用ハンバーガー */}
          <button className="md:hidden" onClick={() => setMenuOpen(true)}>
            <img src="/menu-btn.png" alt="Menu" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      <div className={`fixed top-0 left-0 z-50 h-screen w-3/4 bg-black transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>×</button>
        <nav className="mt-16 flex flex-col space-y-6 px-6">
          <Link href="/" className="text-white text-xl" onClick={() => setMenuOpen(false)}>Home</Link>
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
          {/* Contact の下にSNS */}
          <div className="mt-2 flex space-x-4">
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
