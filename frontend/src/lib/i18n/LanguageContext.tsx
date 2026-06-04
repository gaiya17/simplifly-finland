'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en, { Translations } from '../translations/en';
import fi from '../translations/fi';
import sv from '../translations/sv';
import de from '../translations/de';
import fr from '../translations/fr';
import ru from '../translations/ru';
import es from '../translations/es';
import pl from '../translations/pl';

// ── Types ──────────────────────────────────────────────────────────────────────

export type LanguageCode = 'en' | 'fi' | 'sv' | 'de' | 'fr' | 'ru' | 'es' | 'pl';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

// ── Language Definitions ───────────────────────────────────────────────────────

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: 'gb' },
  { code: 'fi', name: 'Suomi', flag: 'fi' },
  { code: 'sv', name: 'Svenska', flag: 'se' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'ru', name: 'Русский', flag: 'ru' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'pl', name: 'Polski', flag: 'pl' },
];

const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en,
  fi,
  sv,
  de,
  fr,
  ru,
  es,
  pl,
};

// Country code → language code mapping
const COUNTRY_LANG_MAP: Record<string, LanguageCode> = {
  FI: 'fi', // Finland
  SE: 'sv', // Sweden
  DE: 'de', // Germany
  AT: 'de', // Austria
  CH: 'de', // Switzerland
  FR: 'fr', // France
  BE: 'fr', // Belgium
  MC: 'fr', // Monaco
  LU: 'fr', // Luxembourg (also DE, but FR is primary)
  RU: 'ru', // Russia
  BY: 'ru', // Belarus
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  CL: 'es', // Chile
  PE: 'es', // Peru
  VE: 'es', // Venezuela
  PL: 'pl', // Poland
};

const STORAGE_KEY = 'simplifly_lang';

// ── Context ────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  language: Language;
  t: Translations;
  setLanguage: (code: LanguageCode) => void;
  isDetecting: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: LANGUAGES[0],
  t: en,
  setLanguage: () => {},
  isDetecting: false,
});

// ── Provider ───────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCode] = useState<LanguageCode>('en');
  const [isDetecting, setIsDetecting] = useState(false);

  // On mount: read saved preference or detect by IP
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;

    if (saved && TRANSLATIONS[saved]) {
      setLangCode(saved);
      return;
    }

    // No saved preference → detect by IP
    setIsDetecting(true);
    fetch('https://ip-api.com/json?fields=countryCode')
      .then((res) => res.json())
      .then((data) => {
        const countryCode: string = data?.countryCode ?? '';
        const detected: LanguageCode = COUNTRY_LANG_MAP[countryCode] ?? 'en';
        setLangCode(detected);
        localStorage.setItem(STORAGE_KEY, detected);
      })
      .catch(() => {
        // Silently fall back to English if geolocation fails
        setLangCode('en');
      })
      .finally(() => {
        setIsDetecting(false);
      });
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLangCode(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const language = LANGUAGES.find((l) => l.code === langCode) ?? LANGUAGES[0];
  const t = TRANSLATIONS[langCode] ?? en;

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, isDetecting }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

/** Returns current translations object */
export function useTranslation() {
  const { t } = useContext(LanguageContext);
  return { t };
}

/** Returns language state + setter */
export function useLanguage() {
  const { language, setLanguage, isDetecting } = useContext(LanguageContext);
  return { language, setLanguage, isDetecting };
}
