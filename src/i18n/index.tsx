import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import vi_vn from "./locales/vi_vn.json";

export const resources = {
  en: {
    translation: en,
  },
  vi_vn: {
    translation: vi_vn,
  },
};

export const languageNames: Record<string, string> = {
  en: "English",
  vi_vn: "Tiếng Việt",
};

export const flagEmojis: Record<string, string> = {
  en: "🇺🇸",
  vi_vn: "🇻🇳",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi_vn",
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
    }
  });

export default i18n;
