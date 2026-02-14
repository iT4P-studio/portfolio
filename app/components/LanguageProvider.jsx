'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext({
  lang: 'ja',
  isEn: false,
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ja');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('it4p_lang') : null;
    if (stored === 'ja' || stored === 'en') {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('it4p_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    isEn: lang === 'en',
    setLang,
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
