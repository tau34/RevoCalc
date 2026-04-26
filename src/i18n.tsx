import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "ja" | "en";

export type LocalizedText = {
  ja: string;
  en: string;
};

const LOCALE_STORAGE_KEY = "revo-locale";

function detectDeviceLocale(): Locale {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const candidates = [navigator.language, ...(navigator.languages ?? [])]
    .filter(Boolean)
    .map((lang) => lang.toLowerCase());

  return candidates.some((lang) => lang.startsWith("ja")) ? "ja" : "en";
}

const LocaleContext = createContext<Locale>("en");
const LocaleSetterContext = createContext<(locale: Locale) => void>(() => undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const defaultLocale = useMemo(() => detectDeviceLocale(), []);
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof localStorage === "undefined") {
      return defaultLocale;
    }

    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    return savedLocale === "ja" || savedLocale === "en" ? savedLocale : defaultLocale;
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={locale}>
      <LocaleSetterContext.Provider value={setLocale}>
        {children}
      </LocaleSetterContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useSetLocale(): (locale: Locale) => void {
  return useContext(LocaleSetterContext);
}

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale];
}
