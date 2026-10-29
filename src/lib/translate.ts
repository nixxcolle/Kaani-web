import { useLanguage } from './language-context';
import { filipino } from './translations';
import { useCallback } from 'react';

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const english = Object.fromEntries(Object.entries(filipino).map(([en, fil]) => [normalize(fil), en]));

/** Translate presentation text only; IDs, form values, and saved records stay unchanged. */
export function translateText(value: string, language: 'en' | 'fil'): string {
  const key = normalize(value);
  const translated = language === 'fil' ? filipino[key] : english[key];
  return translated ? value.replace(value.trim(), translated) : value;
}

export function useText() {
  const { language } = useLanguage();
  return useCallback(<T,>(value: T): T => {
    if (typeof value === 'string') return translateText(value, language) as T;
    if (Array.isArray(value)) return value.map(item => typeof item === 'string' ? translateText(item, language) : item) as T;
    return value;
  }, [language]);
}
