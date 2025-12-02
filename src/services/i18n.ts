import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { Cookies } from "react-cookie";
import { initReactI18next } from "react-i18next";

import { APP_LANGUAGE_KEY } from "@/constants";

import arApiValidations from "@/locales/api-validations/ar.json";
import ar from "@/locales/ar.json";

import enApiValidations from "@/locales/api-validations/en.json";
import en from "@/locales/en.json";

// Ensure <html> has lang/dir on first load before i18n init
try {
  const cookieLang = new Cookies().get("lang");
  const localStorageLang = localStorage.getItem(APP_LANGUAGE_KEY);
  const initialLng = cookieLang || localStorageLang || "ar";
  const rtlLangs = ["ar", "fa", "ur", "he"];

  document.documentElement.lang = initialLng;
  document.documentElement.dir = rtlLangs.some((l) => initialLng.startsWith(l)) ? "rtl" : "ltr";
} catch {
  // ignore if running in a non-DOM environment
}

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback: (lng: string | readonly string[] | undefined) => void | undefined) => {
    const cookieLang = new Cookies().get("lang");
    const localStorageLang = localStorage.getItem(APP_LANGUAGE_KEY);
    const lng = cookieLang || localStorageLang || "ar";

    callback(lng);
  },
  init: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
        api: enApiValidations,
      },
      ar: {
        translation: ar,
        api: arApiValidations,
      },
    },
    fallbackLng: "ar",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);

  // Save preferences
  localStorage.setItem(APP_LANGUAGE_KEY, lng);
  new Cookies().set("lang", lng, {
    path: "/",
  });
});
