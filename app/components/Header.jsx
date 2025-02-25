"use client";
import React, { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // メニューのリンク項目。何度も書くのを避けるために配列化しておくと楽です。
  const navLinks = [
    { href: '/photo', label: 'Photo works' },
    { href: '/movie', label: 'Movie works' },
    { href: '/price', label: 'Price' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-black border-b border-gray-600">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left side: Home button */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="
              group
              relative
              hidden
              items-center
              px-4
              py-2
              text-white
              transition-colors
              duration-300
              hover:bg-white
              hover:text-black
              md:flex
            "
          >
            {/* 通常時のロゴ(白) */}
            <img
              src="/logo_W.png"
              alt="Home"
              className="
                h-6
                w-auto
                transition-opacity
                duration-300
                group-hover:opacity-0
              "
            />
            {/* ホバー時のロゴ(黒) */}
            <img
              src="/logo_B.png"
              alt="Home Hover"
              className="
                absolute
                top-1/2
                left-1/2
                h-6
                w-auto
                -translate-x-1/2
                -translate-y-1/2
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />
          </Link>

          {/*
            モバイル時のロゴ（テキスト or 小サイズロゴ）表示例
            ここではシンプルに "Home" テキストを表示してみます。
            もし画像を使いたいなら同様に <img> などでもOK
          */}
          <Link
            href="/"
            className="
              text-white
              text-xl
              font-semibold
              md:hidden
            "
          >
            Home
          </Link>
        </div>

        {/* Right side: Hamburger button (モバイル), Menu (大画面) */}
        <div className="flex items-center">
          {/* 大画面用のナビゲーション */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  px-4
                  py-2
                  text-white
                  transition-colors
                  duration-300
                  hover:bg-white
                  hover:text-black
                "
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* モバイル用のハンバーガーボタン */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <img
              src="/menu-btn.png"
              alt="Menu"
              className="h-6 w-6"
            />
          </button>
        </div>
      </nav>

      {/*
        モバイルメニュー:
        menuOpen が true のときに表示し、false のときは非表示
        モダンなスライドインアニメーションを Tailwind で実装
      */}
      <div
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-3/4
          bg-black
          transform
          transition-transform
          duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
      >
        {/* メニューを閉じるボタン */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>

        {/* メニュー項目 */}
        <nav className="mt-16 flex flex-col space-y-6 px-6">
          <Link
            href="/"
            className="text-white text-xl"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-xl"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
