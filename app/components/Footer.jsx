'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { isEn } = useLanguage();
  const text = isEn
    ? '© Copyright iT4P studio. All rights reserved.'
    : '© Copyright iT4P studio All rights reserved.';

  return (
    <footer className="border-t border-white/10 bg-black py-4 text-center text-gray-500">
      {text}
    </footer>
  );
}
