import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <div 
      className="
        flex 
        flex-col 
        md:flex-row 
        md:h-screen 
      "
    >
      {/* 左(もしくは上)カラム: Photo works */}
      <Link
        href="/photo"
        className="
          relative
          group
          flex-1
          bg-cover
          bg-center
          flex
          items-center
          justify-center
        "
        style={{
          backgroundImage: "url('/photo_image.jpg')",
        }}
      >
        {/* 半透明白のオーバーレイ */}
        <div
          className="
            absolute
            inset-0
            bg-white
            opacity-0
            group-hover:opacity-70
            transition
            duration-300
          "
        />
        <span
          className="
            relative
            text-2xl
            font-semibold
            text-black
            opacity-0
            group-hover:opacity-100
            transition
            duration-300
          "
        >
          Photo works
        </span>
      </Link>

      {/* 右(もしくは下)カラム: Movie works */}
      <Link
        href="/movie"
        className="
          relative
          group
          flex-1
          bg-cover
          bg-center
          flex
          items-center
          justify-center
        "
        style={{
          backgroundImage: "url('/movie-image.jpg')",
        }}
      >
        <div
          className="
            absolute
            inset-0
            bg-white
            opacity-0
            group-hover:opacity-70
            transition
            duration-300
          "
        />
        <span
          className="
            relative
            text-2xl
            font-semibold
            text-black
            opacity-0
            group-hover:opacity-100
            transition
            duration-300
          "
        >
          Movie works
        </span>
      </Link>
    </div>
  )
}
