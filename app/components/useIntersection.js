"use client";
import { useRef, useState, useEffect } from "react";

/**
 * 画面内に入ったら "isVisible: true" を返すカスタムフック
 * threshold, rootMargin など必要に応じて調整
 */
export default function useIntersection(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target); // 1度表示されたら解除
      }
    }, options);

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [ref, isVisible];
}
