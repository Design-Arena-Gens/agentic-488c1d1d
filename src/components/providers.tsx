"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "next-themes";
import type { Locale } from "@/lib/i18n";
import { availableLocales, translate } from "@/lib/i18n";

type TranslationContextType = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
  locales: typeof availableLocales;
};

const TranslationContext = createContext<TranslationContextType>({
  locale: "tr",
  t: (key) => key,
  setLocale: () => {},
  locales: availableLocales
});

function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const stored = window.localStorage.getItem("mirac_locale");
    if (stored) {
      setLocaleState((stored as Locale) || "tr");
    }
  }, []);

  const setLocale = (value: Locale) => {
    setLocaleState(value);
    window.localStorage.setItem("mirac_locale", value);
  };

  const contextValue = useMemo(
    () => ({
      locale,
      t: (key: string) => translate(locale, key),
      setLocale,
      locales: availableLocales
    }),
    [locale]
  );

  return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  return useContext(TranslationContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TranslationProvider>{children}</TranslationProvider>
    </ThemeProvider>
  );
}
