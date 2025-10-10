import { useState, useRef, useEffect, createContext, useContext } from "react";
import { i18n, listLanguageCode } from "../i18n";
import useStorage, { STORAGE_KEY } from "../storage";

interface I18nContextProviderProps {
  children: React.ReactNode;
}

type I18nContextType = {
  t: (k: string, ...args: any[]) => string;
  locale: (v: string) => void;
  localeCurrent: string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx)
    throw new Error("useI18n must be used within an I18nContextProvider");
  return ctx;
};

const I18nContextProvider = ({ children }: I18nContextProviderProps) => {
  const [locale, setLocale] = useStorage(STORAGE_KEY.I18N_LANGUAGE, "none");
  const localeRef = useRef<string>(locale);
  const [loaded, setLoaded] = useState(false);

  const translate = (k: string, ...args: any[]) => {
    const texts = i18n[localeRef.current] || i18n["en"];
    let text = texts[k] ? texts[k] : i18n["en"]?.[k] ? i18n["en"]?.[k] : k;
    if (args && args.length > 0) {
      for (let v of args) {
        text = text.replace("'{}'", v);
      }
    }
    return text;
  };

  const onChangeLocale = (v: string) => {
    setLocale(v);
    localeRef.current = v;
  };

  const extractLocale = () => {
    if (locale !== "none") {
      localeRef.current = locale;
    } else {
      let value = "en";
      const l = Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.locale;
      if (listLanguageCode.includes(l)) {
        value = l;
      } else if (l) {
        try {
          const _l = l.split("-")[0];
          for (const item of listLanguageCode) {
            if (_l === item.split("_")[0]) {
              value = item;
              break;
            }
          }
        } catch {}
      }
      setLocale(value);
      localeRef.current = value;
    }
  };

  useEffect(() => {
    extractLocale();
    setLoaded(true);
    // eslint-disable-next-line
  }, []);

  return (
    <I18nContext.Provider
      value={{
        t: translate,
        locale: onChangeLocale,
        localeCurrent: locale,
      }}
    >
      {loaded && children}
    </I18nContext.Provider>
  );
};

export default I18nContextProvider;
