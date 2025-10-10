import en from "./locales/en.json";
import vi_vn from "./locales/vi_vn.json";

const enLocale = en as Record<string, string>;
const viVnLocale = vi_vn as Record<string, string>;

export const i18n: Record<string, Record<string, string>> = {
  en: enLocale,
  vi_vn: viVnLocale,
};

export const listLanguageCode = Object.keys(i18n);

export const languageNames: Record<string, string> = {
  en: "English",
  vi_vn: "Tiếng Việt",
};

export const flagEmojis: Record<string, string> = {
  en: "🇺🇸",
  vi_vn: "🇻🇳",
};
