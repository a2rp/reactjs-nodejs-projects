import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english from "./locales/en/translation.json";
import hindi from "./locales/hi/translation.json";

const supportedLanguages = ["en", "hi"];

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: english },
            hi: { translation: hindi },
        },
        fallbackLng: "en",
        supportedLngs: supportedLanguages,
        debug: false,
        detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"],
        },
        interpolation: { escapeValue: false },
    });

export default i18n;