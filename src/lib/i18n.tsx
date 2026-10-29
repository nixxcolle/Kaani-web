import React, { useState, useEffect } from "react";
import { LanguageContext, type Language } from "./language-context";
import { TRANSLATIONS } from "./i18n-data";
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("kaani_lang");
      return saved === "fil" ? "fil" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("kaani_lang", lang);
      window.dispatchEvent(new CustomEvent("language-change", { detail: lang }));
    } catch (e) {
      console.warn("Failed to persist language choice", e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fil" : "en");
  };

  useEffect(() => {
    try { localStorage.removeItem('kaani_local_registered_users'); } catch { /* Storage may be disabled. */ }
    document.documentElement.lang = language === "fil" ? "fil" : "en";
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "kaani_lang" && (e.newValue === "en" || e.newValue === "fil")) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [language]);

  const t = (key: string, defaultText?: string): string => {
    const table = TRANSLATIONS[language];
    if (table && table[key]) {
      return table[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isFilipino: language === "fil",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
