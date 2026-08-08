import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('ecotrace_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ecotrace_lang', language);
    } catch {}
  }, [language]);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === 'en' ? 'ne' : 'en'));

  /**
   * t(en, ne) — returns the string for the current language.
   * Usage: t('Hello', 'नमस्ते')
   */
  const t = (en, ne) => (language === 'ne' ? ne : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback when used outside provider
    return { language: 'en', toggleLanguage: () => {}, t: (en) => en };
  }
  return ctx;
};

export default LanguageContext;
