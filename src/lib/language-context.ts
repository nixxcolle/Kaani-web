import { createContext, useContext } from "react";
export type Language = "en" | "fil";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
  isFilipino: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
  isFilipino: false,
});


export const useLanguage = () => useContext(LanguageContext);
