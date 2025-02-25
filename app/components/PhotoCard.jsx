"use client";
import Image from "next/image";
import useIntersection from "./useIntersection";

export default function PhotoCard({ src, onClick }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        opacity-0 translate-y-8
        ${isVisible ? "opacity-100 translate-y-0" : ""}
      `}
    >
      <button
        type="button"
        className="block w-full aspect-square overflow-hidden"
        onClick={onClick} 
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
        />
      </button>
    </div>
  );
}
